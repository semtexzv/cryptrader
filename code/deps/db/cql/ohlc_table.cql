CREATE TABLE if not exists main_ks.ohlc
(
    time     BIGINT,
    exchange VARCHAR,
    pair     VARCHAR,
    open     double,
    high     double,
    low      double,
    close    double,
    vol      double,

    PRIMARY KEY ((exchange, pair), time),

);

