SELECT *
FROM (SELECT row_number()
             OVER (
               PARTITION BY exchange, pair
               ORDER BY time ASC ) AS rownum
      FROM ohlc) tmp
WHERE rownum < 3;


SELECT
  first(time, time),
  first(open, time),
  first(high, time),
  first(low, time),
  first(close, time),
  first(vol, time)
FROM ohlc
GROUP BY exchange, pair;