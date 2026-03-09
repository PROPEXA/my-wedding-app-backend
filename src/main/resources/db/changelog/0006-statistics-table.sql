-- liquibase formatted sql

-- changeset alexandevcwa:0006 splitStatements:false
create table tbl_weddings_statistics
(
    sta_wedding_id  integer,
    sta_events_id   integer primary key,
    sta_invitations integer   default 0, -- invitations total for then event
    sta_inv_confirm integer   default 0, -- invitations confirmed
    sta_inv_decline integer   default 0, -- invitations declined
    sta_inv_wait    integer   default 0, -- invitations waiting for response
    sta_people_c    integer   default 0, -- people confirmed
    sta_people_d    integer   default 0, -- people declined
    sta_people_w    integer   default 0, -- people waiting for response
    sta_timestamp   timestamp default current_timestamp,
    foreign key (sta_wedding_id) references tbl_weddings (wed_id),
    foreign key (sta_events_id) references tbl_events (eve_id)
);
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
create or replace function fn_event_statistics_ins() returns trigger as
$$
begin
    insert into tbl_weddings_statistics(sta_wedding_id, sta_events_id, sta_invitations, sta_inv_confirm,
                                        sta_inv_decline,
                                        sta_inv_wait)
    values (new.eve_wedding, new.eve_id, 0, 0, 0, 0);
    return new;
end;
$$ language plpgsql;

create or replace trigger trg_event_statistics_ins
    after insert
    on tbl_events
    for each row
execute function fn_event_statistics_ins();
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
create or replace function fn_invitation_statistics_upd() returns trigger as
$$
declare
    v_people_w integer;
begin
    select inv_quantity into v_people_w from tbl_invitations where inv_id = new.evi_invitation;
    update tbl_weddings_statistics
    set sta_invitations = (coalesce(sta_invitations, 0) + 1),      -- total invitations for the event
        sta_inv_wait    = (coalesce(sta_inv_wait, 0) + 1),         -- invitations waiting for response
        sta_people_w    = (coalesce(sta_people_w, 0) + v_people_w) -- people waiting for response
    where sta_events_id = new.evi_event;
    return new;
end;
$$ language plpgsql;

create or replace trigger trg_invitation_statistics_upd
    after insert
    on tbl_events_invitations
    for each row
execute function fn_invitation_statistics_upd();
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
create or replace function fn_inv_status_statistics_upd() returns trigger as
$$
declare
    v_people integer;
begin
    select inv_quantity into v_people from tbl_invitations where inv_id = new.evi_invitation;
    if (new.evi_status = 'C') then
        update tbl_weddings_statistics
        set sta_inv_confirm = (coalesce(sta_inv_confirm, 0) + 1),     -- invitations confirmed
            sta_inv_wait    = (coalesce(sta_inv_wait, 0) - 1),        -- invitations waiting for response
            sta_people_c    = (coalesce(sta_people_c, 0) + v_people), -- people confirmed
            sta_people_w    = (coalesce(sta_people_w, 0) - v_people)  -- people waiting for response
        where sta_events_id = new.evi_event;
    elsif (new.evi_status = 'D') then
        update tbl_weddings_statistics
        set sta_inv_decline = (coalesce(sta_inv_decline, 0) + 1),     -- invitations declined
            sta_inv_wait    = (coalesce(sta_inv_wait, 0) - 1),        -- invitations waiting for response
            sta_people_d    = (coalesce(sta_people_d, 0) + v_people), -- people declined
            sta_people_w    = (coalesce(sta_people_w, 0) - v_people)  -- people waiting for response
        where sta_events_id = new.evi_event;
    end if;
    return new;
end;
$$ language plpgsql;

create or replace trigger trg_inv_status_statistics_upd
    after update of evi_status
    on tbl_events_invitations
    for each row
execute function fn_inv_status_statistics_upd();
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------