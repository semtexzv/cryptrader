CREATE OR REPLACE FUNCTION calculate_rescaled_ohlc(_exch VARCHAR, _pair VARCHAR, period BIGINT, start BIGINT,
                                                   _end  BIGINT)
  RETURNS TABLE("time" BIGINT, open DOUBLE PRECISION, high DOUBLE PRECISION, low DOUBLE PRECISION, close DOUBLE PRECISION, vol DOUBLE PRECISION) AS
$$
SELECT
  time_bucket(period, t.time) AS "stime",
  first(t.open, t.time)       AS open,
  max(t.high)                 AS high,
  min(t.low)                  AS low,
  last(t.close, t.time)       AS close,
  sum(t.vol)                  AS vol
FROM ohlc t
WHERE t.pair = _pair AND t.exchange = _exch AND t.time >= start AND
      t.time < ((_end + period) / period) * period
GROUP BY "stime"
ORDER BY stime DESC;
$$
LANGUAGE SQL
STABLE;

CREATE OR REPLACE FUNCTION calculate_rescaled_ohlc(_exch VARCHAR, _pair VARCHAR, period BIGINT, start BIGINT)
  RETURNS TABLE("time" BIGINT, open DOUBLE PRECISION, high DOUBLE PRECISION, low DOUBLE PRECISION, close DOUBLE PRECISION, vol DOUBLE PRECISION) AS
$$
SELECT *
FROM calculate_rescaled_ohlc(_exch, _pair, period, start, 922337203685477580);

$$
LANGUAGE SQL
STABLE;


CREATE TABLE IF NOT EXISTS cached_ohlc (
  LIKE ohlc,
  period BIGINT,
  PRIMARY KEY (pair, exchange, period, time)
);

CREATE OR REPLACE FUNCTION _generate_ohlc_cache(_exch VARCHAR, _pair VARCHAR, _period BIGINT, _start BIGINT,
                                                _end  BIGINT)
  RETURNS VOID
AS
$$
BEGIN
  INSERT INTO cached_ohlc
    (SELECT
       c.time,
       _exch,
       _pair,
       c.open,
       c.high,
       c.low,
       c.close,
       c.vol,
       _period
     FROM calculate_rescaled_ohlc(_exch, _pair, _period, _start, _end) c
    )
  ON CONFLICT (time, exchange, pair, period)
    DO UPDATE
      SET open = EXCLUDED.open,
        high   = EXCLUDED.high,
        low    = EXCLUDED.low,
        close  = EXCLUDED.close,
        vol    = EXCLUDED.vol;
END;
$$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_ohlc_with_cache(_exch VARCHAR, _pair VARCHAR, _period BIGINT, since BIGINT)
  RETURNS TABLE("time" BIGINT, open DOUBLE PRECISION, high DOUBLE PRECISION, low DOUBLE PRECISION, close DOUBLE PRECISION, vol DOUBLE PRECISION) AS
$$
DECLARE
  cached_start BIGINT;
  cached_end   BIGINT;
BEGIN

  SELECT
    coalesce(min(c.time), 0),
    coalesce(max(c.time), 0)
  INTO cached_start, cached_end
  FROM cached_ohlc c
  WHERE c.pair = _pair AND c.exchange = _exch AND c.period = _period;

  -- Insert calculated values into cached table

  IF cached_start > since
  THEN
    EXECUTE _generate_ohlc_cache(_exch, _pair, _period, since, cached_start);
  END IF;


  IF cached_end < since
  THEN
    EXECUTE _generate_ohlc_cache(_exch, _pair, _period, cached_end, 922337203685477580);
  ELSE
    EXECUTE _generate_ohlc_cache(_exch, _pair, _period, since, 922337203685477580);
  END IF;

  -- Return values from cached table
  RETURN QUERY SELECT
                 c.time  AS time,
                 c.open  AS open,
                 c.high  AS high,
                 c.low   AS low,
                 c.close AS close,
                 c.vol   AS vol
               FROM cached_ohlc c
               WHERE c.exchange = _exch AND c.pair = _pair AND c.period = _period AND c.time >= since;
END;
$$
LANGUAGE plpgsql;




