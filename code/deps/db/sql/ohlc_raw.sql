with data as (select time, open, high, low, close, vol
              from ohlc
              where exchange = $1
                and pair = $2
                and time > $4
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
