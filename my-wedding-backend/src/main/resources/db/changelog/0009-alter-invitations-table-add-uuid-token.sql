-- liquibase formatted sql

-- changeset alexandevcwa:0008 splitStatements:false
alter table tbl_invitations add column inv_uuid varchar(36);