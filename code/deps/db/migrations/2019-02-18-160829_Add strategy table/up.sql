-- Your SQL goes here

create table if not exists strategies
(
  id      serial primary key,
  owner   integer                  not null,
  body    text                     not null,
  created timestamp with time zone not null default now(),
  updated timestamp with time zone not null default now(),
  foreign key (owner) references users
);

create trigger strategy_updated
  before insert or update
  on strategies
  for each row
execute procedure update_timestamp();
