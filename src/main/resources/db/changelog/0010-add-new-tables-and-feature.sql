-- liquibase formatted sql

-- changeset alexandevcwa:1
-- comment: Agregar restriccion unica a usuarios en tbl_accounts
alter table tbl_accounts
    add constraint uq_tbl_accounts_user unique (acc_user);
-- rollback ALTER TABLE tbl_accounts DROP CONSTRAINT uq_tbl_accounts_user;

-- changeset alexandevcwa:2
-- comment: Agregar restricciones unica y llave foranea a tbl_invitations
alter table tbl_invitations
    add unique (inv_uuid);
alter table tbl_invitations
    add foreign key (inv_relation) references tbl_relations (rl_id);
-- rollback ALTER TABLE tbl_invitations DROP CONSTRAINT fk_tbl_invitations_relation;
-- rollback ALTER TABLE tbl_invitations DROP CONSTRAINT uq_tbl_invitations_uuid;

-- changeset alexandevcwa:3
-- comment: Hacer obligatoria la columna evt_name en tipos de eventos
alter table tbl_events_type
    alter column evt_name set
        not null;
-- rollback ALTER TABLE tbl_events_type ALTER COLUMN evt_name DROP NOT NULL;

-- changeset alexandevcwa:4
-- comment: Eliminar tablas obsoletas (invitations_detail y schedules)
drop table if exists tbl_invitations_detail;
drop table if exists tbl_schedules;
-- rollback -- ATENCION: Para hacer rollback de esto, debes pegar aqui los CREATE TABLE originales de estas dos tablas.

-- changeset alexandevcwa:5
-- comment: Crear tabla para los protagonistas de la boda (novios y padres)
create table tbl_wedding_principals
(
    wp_id         integer primary key,
    wp_type       varchar(1)  not null,
    check (wp_type in ('G', 'B')),
    wp_fn         varchar(50) not null,
    wp_ln         varchar(50) not null,
    wp_br         date null,
    wp_email      varchar(40) null,
    wp_gender     varchar(1)  not null,
    check (wp_gender in ('M', 'F')),
    wp_phone      varchar(20) null,
    wp_registered timestamp null default current_timestamp,
    wp_updated    timestamp null,
    wp_status     varchar(1)  not null,
    check (wp_status in ('A', 'I')),
    wp_wedding    integer     not null,
    foreign key (wp_wedding) references tbl_weddings (wed_id)
);
-- rollback DROP TABLE tbl_wedding_principals;

-- changeset alexandevcwa:6
-- comment: Crear tabla de configuracion para el formato de invitaciones
create table tbl_invitation_settings
(
    is_wedding  integer primary key,
    is_phrase   text null,
    check (length(is_phrase) <= 400),
    is_register timestamp default current_timestamp,
    is_updated  timestamp,
    foreign key (is_wedding) references tbl_weddings (wed_id)
);
-- rollback DROP TABLE tbl_invitation_settings;