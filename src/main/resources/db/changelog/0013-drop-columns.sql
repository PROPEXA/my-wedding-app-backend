-- liquibase formatted sql

-- changeset alexandevcwa:1
-- comment: Eliminar columnas que no se utilizan
begin;
alter table tbl_wedding_principals drop column wp_gender;