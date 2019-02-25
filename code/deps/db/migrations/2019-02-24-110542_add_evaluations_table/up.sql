-- Your SQL goes here

create table if not exists evaluations
(
  strategy_id integer                  not null,
  exchange    text                     not null,
  pair        text                     not null,
  period      text                     not null,
  owner_id    integer                  not null,

  time        timestamp with time zone not null default now(),

  status      boolean                  not null,
  ok          text,
  error       text,

  primary key (strategy_id, exchange, pair, owner_id, period, time),
  foreign key (strategy_id) references strategies (id)
)