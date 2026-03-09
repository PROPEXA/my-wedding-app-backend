-- liquibase formatted sql

-- changeset alexandevcwa:0005 splitStatements:false
alter table tbl_events alter column eve_loc_lat type varchar(100);
alter table tbl_events alter column eve_loc_lng type varchar(100);
