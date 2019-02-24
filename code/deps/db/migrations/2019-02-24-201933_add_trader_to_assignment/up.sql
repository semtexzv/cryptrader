alter table assignments
  add column trader_id INTEGER;

alter table assignments
  add foreign key (trader_id) references traders (id);
