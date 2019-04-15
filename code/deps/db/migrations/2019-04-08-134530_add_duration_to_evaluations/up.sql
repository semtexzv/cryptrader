-- Your SQL goes here

alter table evaluations
    add column IF NOT EXISTS duration bigint not null default 0;