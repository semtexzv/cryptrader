/*
SELECT
  time_bucket($3 * 60, t.time) AS time,
  first(t.open, t.time)        AS open,
  max(t.high)                  AS high,
  min(t.low)                   AS low,
  last(t.close, t.time)        AS close,
  sum(t.vol)                   AS vol
FROM ohlc t
WHERE t.exchange = $1 AND t.pair = $2 AND t.time >= $4
GROUP BY time
ORDER BY time DESC
LIMIT 400;
 */

SELECT *
FROM calculate_rescaled_ohlc($1, $2, $3, $3);