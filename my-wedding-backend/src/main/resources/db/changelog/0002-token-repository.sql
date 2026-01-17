create table tbl_refresh_token
(
    tk_id       varchar(36) primary key,
    tk_token    text        not null unique,
    tk_type     varchar(12) not null,
    tk_revoked  varchar(1) default 'N',
    check ( tk_revoked in ('Y', 'N') ),
    tk_expired  varchar(1) default 'N',
    check ( tk_expired in ('Y', 'N') ),
    tk_account  integer references tbl_accounts (acc_id),
    tk_register timestamp  default current_timestamp
);