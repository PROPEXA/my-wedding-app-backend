-- liquibase formatted sql

-- changeset alexandevcwa:1
-- comment: Sequence to generate ids for wedding_principals table
create sequence seq_wedding_principals start with 1 increment by 1;