CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

CREATE TABLE ohlc (
                    time     BIGINT  NOT NULL,
                    exchange VARCHAR NOT NULL,
                    pair     VARCHAR NOT NULL,
                    open     FLOAT   NOT NULL,
                    high     FLOAT   NOT NULL,
                    low      FLOAT   NOT NULL,
                    close    FLOAT   NOT NULL,
                    vol      FLOAT   NOT NULL,

                    PRIMARY KEY (pair, exchange, time)
);

SELECT create_hypertable('ohlc', 'time', chunk_time_interval => 60 * 60 * 24 * 2);
