select distinct ON (exchange,pair) *
from ohlc
where time > extract(epoch from now() - interval '1 day')
order by exchange, pair, time desc;
