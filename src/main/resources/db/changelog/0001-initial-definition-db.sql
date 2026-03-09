-- liquibase formatted sql

-- changeset alexandevcwa:0001
create table tbl_languages
(
    iso639_1     varchar(2) primary key,
    iso639_2     varchar(3) unique  not null,
    native_name  varchar(30) unique not null,
    english_name varchar(30) unique not null,
    direction    varchar(10),
    is_active    varchar(1) default 'Y',
    check ( is_active in ('Y', 'N') ),
    created_at   timestamp  default current_timestamp,
    updated_at   timestamp
);

INSERT INTO tbl_languages (iso639_1, iso639_2, native_name, english_name, direction, is_active, created_at)
VALUES ('EN', 'ENG', 'English', 'English', 'LTR', 'Y', CURRENT_TIMESTAMP),
       ('ES', 'SPA', 'Español', 'Spanish', 'LTR', 'Y', CURRENT_TIMESTAMP);
commit;

create table tbl_users
(
    usr_id        integer primary key,
    usr_firstname varchar(50) not null,
    usr_lastname  varchar(50) not null,
    usr_birthdate date        not null,
    usr_register  timestamp default current_timestamp,
    usr_modified  timestamp
);

create sequence seq_tbl_users start with 1 increment by 1;

create table tbl_accounts
(
    acc_id        integer primary key,
    acc_email     varchar(40)  not null,
    acc_emailconf varchar(1)   not null,
    acc_password  varchar(100) not null,
    acc_status    varchar(1) default 'A',
    check ( acc_status in ('A', 'I') ),
    acc_register  timestamp  default current_timestamp,
    acc_updated   timestamp,
    acc_user      integer      not null,
    acc_lang      varchar(2)   not null,
    foreign key (acc_user) references tbl_users (usr_id),
    foreign key (acc_lang) references tbl_languages (iso639_1)
);

create sequence seq_tbl_accounts start with 1 increment by 1;

create table tbl_weddings
(
    wed_id        integer primary key,
    wed_account   integer     not null,
    wed_bride_fn  varchar(50) not null,
    wed_bride_ln  varchar(50) not null,
    wed_bride_br  date,
    wed_bride_ema varchar(40),
    wed_bride_tel varchar(20),
    wed_groom_fn  varchar(50) not null,
    wed_groom_ln  varchar(50) not null,
    wed_groom_br  date,
    wed_groom_ema varchar(40),
    wed_groom_tel varchar(20),
    wed_register  timestamp  default current_timestamp,
    wed_updated   timestamp,
    wed_status    varchar(1) default 'A',
    check ( wed_status in ('A', 'I') )
);

create sequence seq_tbl_wedding start with 1 increment by 1;

create table tbl_events_type
(
    evt_id       integer primary key,
    evt_name     varchar(30) unique,
    evt_register timestamp default current_timestamp,
    evt_modified timestamp
);

create sequence seq_tbl_events_type start with 1 increment by 1;

INSERT INTO tbl_events_type (evt_id, evt_name)
VALUES (nextval('seq_tbl_events_type'), 'Pedida de Mano'),
       (nextval('seq_tbl_events_type'), 'Cena de Ensayo'),
       (nextval('seq_tbl_events_type'), 'Boda Civil'),
       (nextval('seq_tbl_events_type'), 'Ceremonia Religiosa'),
       (nextval('seq_tbl_events_type'), 'Ceremonia Simbólica');
commit;

create table tbl_events
(
    eve_id       integer primary key,
    eve_date_ini timestamptz  not null,
    eve_date_fin timestamptz  null,
    eve_title    varchar(100) not null,
    eve_type     integer,
    eve_address  varchar(200) not null,
    eve_loc_lat  numeric(11, 8),
    eve_loc_lng  numeric(11, 8),
    eve_sequence numeric(2),
    eve_wedding  integer      not null,
    eve_register timestamp  default current_timestamp,
    eve_modified timestamp,
    eve_status   varchar(1) default 'A',
    check ( eve_status in ('A', 'I') ),
    foreign key (eve_type) references tbl_events_type (evt_id),
    foreign key (eve_wedding) references tbl_weddings (wed_id)
);

create sequence seq_tbl_events start with 1 increment by 1;

create table tbl_schedules
(
    sch_id          integer primary key,
    sch_event       integer      not null,
    sch_title       varchar(100) not null,
    sch_description text,
    sch_start_time  timestamp without time zone,
    sch_end_time    timestamp without time zone,
    sch_created_at  timestamp,
    sch_status      varchar(1) default 'A',
    check ( sch_status in ('A', 'I') ),
    foreign key (sch_event) references tbl_events (eve_id)
);

create sequence seq_tbl_schedules start with 1 increment by 1;

create table tbl_relations
(
    rl_id       integer primary key,
    rl_name     varchar(50) not null unique,
    rl_register timestamp default current_timestamp,
    rl_modified timestamp
);

create sequence seq_tbl_relations start with 1 increment by 1;

INSERT INTO tbl_relations (rl_id, rl_name)
VALUES
-- Núcleo Familiar
(nextval('seq_tbl_relations'), 'Padres'),
(nextval('seq_tbl_relations'), 'Hermanos'),

-- Familia Extendida
(nextval('seq_tbl_relations'), 'Familiares'),

-- Figuras Importantes (Bodas/Bautizos)
(nextval('seq_tbl_relations'), 'Padrino'),
(nextval('seq_tbl_relations'), 'Madrina'),

-- Familia Política (Suegros/Cuñados)
(nextval('seq_tbl_relations'), 'Suegros'),
(nextval('seq_tbl_relations'), 'Cuñados'),

-- Círculo Social
(nextval('seq_tbl_relations'), 'Amigos'),
(nextval('seq_tbl_relations'), 'Conocidos'),
(nextval('seq_tbl_relations'), 'Vecinos'),

-- Círculo Laboral / Profesional
(nextval('seq_tbl_relations'), 'Compañeros de Trabajo');

create table tbl_invitations
(
    inv_id       integer primary key,
    inv_title    varchar(150),
    inv_quantity numeric(2),
    inv_relation integer     not null,
    inv_tablenum varchar(10),
    inv_maxconf  timestamptz not null,
    inv_register timestamp default current_timestamp,
    inv_modified timestamp
);

create sequence seq_tbl_invitations start with 1 increment by 1;

create table tbl_events_invitations
(
    evi_event      integer,
    evi_invitation integer,
    evi_status     varchar(1) default 'P',
    check ( evi_status in ('P', 'C', 'D') ), --Pending, Confirmed, Denied
    evi_mod_utc    timestamp  default current_timestamp,
    evi_mod_tz     timestamptz,
    primary key (evi_event, evi_invitation),
    foreign key (evi_event) references tbl_events (eve_id),
    foreign key (evi_invitation) references tbl_invitations (inv_id)
);

create table tbl_invitations_detail
(
    ind_id         integer primary key,
    ind_fullname   varchar(100) not null,
    ind_invitation integer      not null,
    ind_register   timestamp  default current_timestamp,
    ind_modified   timestamp,
    ind_status     varchar(1) default 'A',
    check ( ind_status in ('A', 'I') ),
    foreign key (ind_invitation) references tbl_invitations (inv_id)
);

create sequence seq_tbl_invitations_detail start with 1 increment by 1;