-- liquibase formatted sql

-- changeset alexandevcwa:0008 splitStatements:false
create
    or replace function fn_inv_delete_statistics_upd() returns trigger as
$$
declare
    v_people integer;
begin
    select inv_quantity
    into v_people
    from tbl_invitations
    where inv_id = old.evi_invitation;
    if
        (TG_OP = 'DELETE') then
        update tbl_weddings_statistics
        set sta_invitations = (coalesce(sta_invitations, 0) - 1),
            sta_inv_wait    = (coalesce(sta_inv_wait, 0) - 1),
            sta_people_w    = (coalesce(sta_people_w, 0) - v_people),
            sta_timestamp   = current_timestamp
        where sta_events_id = old.evi_event;
    end if;
    return old;
end;
$$
    language plpgsql;

create
    or replace trigger trg_inv_delete_statistics_upd
    after delete
    on tbl_events_invitations
    for each row
execute function fn_inv_delete_statistics_upd();