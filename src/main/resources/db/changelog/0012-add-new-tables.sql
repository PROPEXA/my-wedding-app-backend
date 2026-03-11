-- liquibase formatted sql

-- changeset alexandevcwa:1
-- comment: Crear tabla catalogo de tipos de relaciones
create table tbl_relationships
(
    rel_id          INTEGER primary key,
    rel_name        VARCHAR(50) not null
        constraint uq_rel_name unique,
    rel_description VARCHAR(100) null,
    rel_gender      VARCHAR(1)  not null,
    check (rel_gender in ('M', 'F', 'N')),
    rel_status      VARCHAR(1)  not null,
    check (rel_status in ('A', 'I')),
    rel_created     TIMESTAMP null default current_timestamp,
    rel_updated     TIMESTAMP null
);
-- rollback DROP TABLE tbl_relationships;

-- changeset alexandevcwa:2
create sequence seq_relationships start with 1 increment by 1;
-- rollback DROP SEQUENCE seq_relationships;

-- changeset alexandevcwa:3
-- comment: Insertar catalogo de parentescos y tipos de relación exacta
INSERT INTO tbl_relationships (rel_id, rel_name, rel_description, rel_gender, rel_status)
VALUES (nextval('seq_relationships'), 'Padre', 'Padre biológico, adoptivo o de crianza', 'M', 'A'),
       (nextval('seq_relationships'), 'Madre', 'Madre biológica, adoptiva o de crianza', 'F', 'A'),
       (nextval('seq_relationships'), 'Hermano', 'Hermano', 'M', 'A'),
       (nextval('seq_relationships'), 'Hermana', 'Hermana', 'F', 'A'),
       (nextval('seq_relationships'), 'Abuelo', 'Abuelo materno o paterno', 'M', 'A'),
       (nextval('seq_relationships'), 'Abuela', 'Abuela materna o paterna', 'F', 'A'),
       (nextval('seq_relationships'), 'Tío', 'Tío materno o paterno', 'M', 'A'),
       (nextval('seq_relationships'), 'Tía', 'Tía materna o paterna', 'F', 'A'),
       (nextval('seq_relationships'), 'Primo', 'Primo', 'M', 'A'),
       (nextval('seq_relationships'), 'Prima', 'Prima', 'F', 'A'),
       (nextval('seq_relationships'), 'Sobrino', 'Sobrino', 'M', 'A'),
       (nextval('seq_relationships'), 'Sobrina', 'Sobrina', 'F', 'A'),
       (nextval('seq_relationships'), 'Cuñado', 'Hermano del cónyuge', 'M', 'A'),
       (nextval('seq_relationships'), 'Cuñada', 'Hermana del cónyuge', 'F', 'A'),
       (nextval('seq_relationships'), 'Suegro', 'Padre del cónyuge', 'M', 'A'),
       (nextval('seq_relationships'), 'Suegra', 'Madre del cónyuge', 'F', 'A'),
       (nextval('seq_relationships'), 'Amigo', 'Amistad', 'M', 'A'),
       (nextval('seq_relationships'), 'Amiga', 'Amistad', 'F', 'A'),
       (nextval('seq_relationships'), 'Compañero de trabajo', 'Colega o ex-colega', 'M', 'A'),
       (nextval('seq_relationships'), 'Compañera de trabajo', 'Colega o ex-colega', 'F', 'A'),
       (nextval('seq_relationships'), 'Otro', 'Relación no especificada', 'N', 'A');
-- rollback TRUNCATE TABLE tbl_relationships RESTART IDENTITY CASCADE;

-- changeset alexandevcwa:4
-- comment: Columna nueva para los tipos de relaciones
alter table tbl_wedding_principals
    add column wp_relation integer null;
-- rollback alter table tbl_wedding_principals drop column wp_relation;

-- changeset alexandevcwa:5
-- comment: Llave foránea para la columna nueva
alter table tbl_wedding_principals
    add constraint fk_wedding_principals_to_relations
        foreign key (wp_relation)
            references tbl_relationships (rel_id);
-- rollback alter table tbl_wedding_principals drop constraint fk_wedding_principals_to_relations
