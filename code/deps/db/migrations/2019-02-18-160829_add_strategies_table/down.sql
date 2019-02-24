-- This file should undo anything in `up.sql`

drop trigger if exists strategy_updated on strategies;
drop table  if exists strategies cascade ;