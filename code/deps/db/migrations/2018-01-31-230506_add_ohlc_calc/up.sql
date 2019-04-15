CREATE TABLE IF NOT EXISTS ohlc_rollups
(
    LIKE ohlc,
    period BIGINT,
    PRIMARY KEY (pair, exchange, period, time)
);


create or replace function locf_s(a float, b float)
    returns float
    language sql
as
'
    SELECT COALESCE(b, a)
';

drop aggregate if exists locf(float);
create aggregate locf(float) (
    sfunc = locf_s,
    stype = float
    );


create or replace function rescaled_ohlc(varchar, varchar, bigint, bigint, bigint = 1000000000000)
    RETURNS TABLE
            (
                "time" BIGINT,
                open   DOUBLE PRECISION,
                high   DOUBLE PRECISION,
                low    DOUBLE PRECISION,
                close  DOUBLE PRECISION,
                vol    DOUBLE PRECISION
            ) AS
$$
with cached as (select time as bucket,
                       open,
                       high,
                       low,
                       close,
                       vol
                from ohlc_rollups
                where exchange = $1
                  and pair = $2
                  and time >= $4
                  and time < $5
                  and period = $3
                order by bucket asc
                limit 1000
),

     calculated as (SELECT time_bucket($3, t.time) AS bucket,
                           first(t.open, t.time)   AS open,
                           max(t.high)             AS high,
                           min(t.low)              AS low,
                           last(t.close, t.time)   AS close,
                           sum(t.vol)              AS vol
                    FROM ohlc t
                    WHERE t.pair = $2
                      AND t.exchange = $1
                      AND t.time > coalesce((select max(bucket) from cached), 0)
                      AND t.time >= $4
                      AND t.time < $5
                    GROUP BY bucket
                    ORDER BY bucket asc
                    limit 1000),

     min as (select coalesce(min(bucket), $4) as bucket from cached),
     max as (select coalesce(max(bucket), $5) as bucket from calculated),


     insert as (insert into ohlc_rollups
         select bucket,
                $1,
                $2,
                open,
                high,
                low,
                close,
                vol,
                $3 as period
         from calculated
         where case when $3 > 120 then 1 else 0 end = 1
         on conflict do nothing
     ),

     filtered as (select *
                  from calculated
                  union
                  (select * from cached)
     ),

     times as (select generate_series as bucket
               from generate_series((select bucket from min), (select bucket from max), $3)
               order by bucket asc
               limit 1000
     )
        ,

     filled as (select *
                from filtered
                         right join times using (bucket)
                order by bucket desc
                limit 1000
     ),

     backfilled as (
         select bucket,
                coalesce(open, locf(filled.close) over win)  as open,
                coalesce(high, locf(filled.close) over win)  as high,
                coalesce(low, locf(filled.close) over win)   as low,
                coalesce(close, locf(filled.close) over win) as close,
                coalesce(vol, 0)                             as volume
         from filled window
             win as (order by filled.bucket asc ROWS 50 preceding)
         order by bucket asc
         limit 1000)
select *
from backfilled
where open is not null
order by bucket asc
$$ language SQL;
