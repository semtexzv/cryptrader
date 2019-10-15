with data as (select time, open, high, low, close, vol
              from ohlc
              where pair_id > $1
                and time > $2
              order by time asc
              limit 1000
)

select time,
       open,
       high,
       low,
       close,
       vol
from data
order by time asc
