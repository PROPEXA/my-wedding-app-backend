-- liquibase formatted sql

-- changeset alexandevcwa:0004 splitStatements:false
alter table tbl_events
    add column eve_created_by integer not null;
alter table tbl_events
    add foreign key (eve_created_by) references tbl_accounts (acc_id);
alter table tbl_events
    add column eve_modified_by integer;
alter table tbl_events
    add foreign key (eve_modified_by) references tbl_accounts (acc_id);

alter table tbl_invitations
    add column inv_created_by integer not null;
alter table tbl_invitations
    add foreign key (inv_created_by) references tbl_accounts (acc_id);
alter table tbl_invitations
    add column inv_modified_by integer;
alter table tbl_invitations
    add foreign key (inv_modified_by) references tbl_accounts (acc_id);
alter table tbl_invitations
    add column inv_guest_list jsonb not null;

alter table tbl_events_invitations
    add column evi_created_by integer not null;
alter table tbl_events_invitations
    add foreign key (evi_created_by) references tbl_accounts (acc_id);
alter table tbl_events_invitations
    add column evi_modified_by integer;
alter table tbl_events_invitations
    add foreign key (evi_modified_by) references tbl_accounts (acc_id);