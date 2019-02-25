-- Your SQL goes here

create table if not exists assignments
(
  exchange    text    not null,
  pair        text    not null,
  owner_id    integer not null,

  period      text    not null,
  strategy_id integer not null,

  primary key (exchange, pair, owner_id),
  foreign key (owner_id) references users (id),
  foreign key (strategy_id) references strategies (id)
);