create materialized view pairs(exchange, pair, count) as
select ohlc.exchange, ohlc.pair, count(*) as count
from ohlc
where time > extract(epoch from now() - interval '2 days')
group by (ohlc.exchange, ohlc.pair)
order by count desc;

refresh materialized view pairs;