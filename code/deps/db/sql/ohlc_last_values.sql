select o.time as time,
       exchange,
       pair,
       open,
       high,
       low,
       close,
       vol
from ohlc o
         inner join (
    select pair_id, max(time) as time
    from ohlc

    group by pair_id
) a on o.pair_id = a.pair_id and a.time = o.time
         join pairs p on o.pair_id = p.id;