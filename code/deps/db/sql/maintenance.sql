refresh materialized view pairs;

delete
from ohlc o
where (select count from pairs p where p.exchange = o.exchange and p.pair = o.pair) < 20
  and time > extract(epoch from (now() - interval '5 days'))::bigint;

refresh materialized view pairs;

delete from assignments;