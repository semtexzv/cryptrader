with data as (select time, open, high, low, close, vol
              from ohlc
              where exchange = $1
                and pair = $2
                and time > $4
              limit 1000),

     bounds as (select coalesce(max(time), 0) as max, coalesce(min(time), 0) as min from data),

     times as (select generate_series as time
               from generate_series((select min from bounds), (select max from bounds), 60)
               order by time asc
               limit 1000
     ),

     joined as (select *
                from times
                         left join data using (time)
                order by time asc),

     backfilled as (
         select time,
                coalesce(open, locf(joined.close) over win)  as open,
                coalesce(high, locf(joined.close) over win)  as high,
                coalesce(low, locf(joined.close) over win)   as low,
                coalesce(close, locf(joined.close) over win) as close,
                coalesce(vol, 0)                             as volume
         from joined window
             win as (order by joined.time asc ROWS unbounded preceding)
         order by time asc
         limit 1000),

     insert as (insert into ohlc (
         select time,
                $1,
                $2,
                open,
                high,
                low,
                close,
                volume
         from backfilled
         where open is not null
     )
         ON conflict do nothing
     )

select time,
       open,
       high,
       low,
       close,
       volume as vol
from backfilled
