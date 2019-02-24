-- Your SQL goes here

create table if not exists assignments
(
  exchange    text    not null,
  pair        text    not null,

  period      text    not null,
  strategy_id integer not null,

  primary key (exchange, pair),
  foreign key (strategy_id) references strategies (id)
);