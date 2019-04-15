-- Your SQL goes here

CREATE EXTENSION IF NOT EXISTS pgcrypto CASCADE;
create table if not exists trades
(
    uuid      uuid                     not null default gen_random_uuid(),
    time      timestamp with time zone not null default now(),

    trader_id integer                  not null,
    exchange  varchar                  not null,
    pair      varchar                  not null,
    period    varchar                  not null,

    buy       boolean                  not null,
    amount    double precision         not null,
    price     double precision         not null,

    status    boolean                  not null,
    ok        text,
    error     text,

    foreign key (trader_id) references traders,
    primary key (uuid)

)