-- liquibase formatted sql

-- changeset alexandevcwa:0007 splitStatements:false
alter table tbl_events alter column eve_date_ini type timestamp without time zone;
alter table tbl_events alter column eve_date_fin type timestamp without time zone;
