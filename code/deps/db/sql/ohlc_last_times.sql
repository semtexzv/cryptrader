SELECT exchange,
       pair,
       max(time) AS time
FROM ohlc
WHERE exchange = $1
  and time >= $2
GROUP BY pair, exchange;