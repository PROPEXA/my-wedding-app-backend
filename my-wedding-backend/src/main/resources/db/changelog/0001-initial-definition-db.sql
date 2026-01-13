-- liquibase formatted sql

-- changeset alexandevcwa:0001
drop table if exists tbl_languages cascade;
create table tbl_languages
(
    id           integer primary key,
    iso639_1     varchar(2) unique  not null,
    iso639_2     varchar(3) unique  not null,
    native_name  varchar(30) unique not null,
    english_name varchar(30) unique not null,
    direction    varchar(10),
    is_active    varchar(1) default 'Y',
    check ( is_active in ('Y', 'N') ),
    created_at   timestamp  default current_timestamp,
    updated_at   timestamp
);

drop sequence if exists seq_languages cascade;
create sequence seq_languages start with 1 increment by 1;

INSERT INTO tbl_languages (id, iso639_1, iso639_2, native_name, english_name, direction, is_active, created_at)
VALUES (nextval('seq_languages'), 'EN', 'ENG', 'English', 'English', 'LTR', 'Y', CURRENT_TIMESTAMP),
       (nextval('seq_languages'), 'ES', 'SPA', 'Español', 'Spanish', 'LTR', 'Y', CURRENT_TIMESTAMP);
commit;

drop table if exists tbl_accounts cascade;
create table tbl_accounts
(
    id             integer primary key,
    first_name     varchar(30)        not null,
    last_name      varchar(30)        not null,
    email          varchar(50) unique not null,
    email_verified varchar(1) default 'N',
    check ( email_verified in ('Y', 'N') ),
    password       varchar(100)       not null,
    birth_date     date               not null,
    status         varchar(4) default 'A',
    check ( status in ('A', 'I', 'S') ), -- active, inactive, suspended
    created_at     timestamp  default current_timestamp,
    updated_at     timestamp,
    language_id    integer references tbl_languages (id)
);

drop index if exists idx_accounts_email;
create unique index idx_accounts_email on tbl_accounts (email);
drop sequence if exists seq_accounts cascade;
create sequence seq_accounts start with 1 increment by 1;