-- Your SQL goes here

create table if not exists eval_requests
(
  strategy_id integer not null,
  exchange    text    not null,
  pair        text    not null,
  period      text    not null,

  primary key (strategy_id, exchange, pair, period),
  foreign key (strategy_id) references strategies (id)
);