create table tbl_account_confirmation
(
    id           varchar(36) primary key,
    token        text         not null,
    access_code  varchar(100) not null,
    created_at   timestamp  default current_timestamp,
    updated_at   timestamp,
    is_expired   varchar(1) default 'N',
    is_confirmed varchar(1) default 'N',
    check ( is_expired in ('Y', 'N') ),
    account_id   integer      not null references tbl_accounts (acc_id)
);

create index idx_account_confirmation_token on tbl_account_confirmation (token);

create or replace function fn_trg_account_confirmation_upd() returns trigger as
$$
begin
    if NEW.is_confirmed = 'Y' then
        update tbl_accounts set acc_emailconf = 'Y' where acc_id = OLD.account_id;
    end if;

    return new;
end;
$$ language plpgsql;

create trigger trg_account_confirmation_upd
    before update
        of is_confirmed
    on tbl_account_confirmation
    for each row
execute procedure fn_trg_account_confirmation_upd();