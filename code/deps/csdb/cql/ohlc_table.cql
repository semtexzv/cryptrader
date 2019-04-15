
CREATE TABLE if not exists main_ks.ohlc
(
    time     BIGINT  ,
    exchange VARCHAR ,
    pair     VARCHAR ,
    open     FLOAT   ,
    high     FLOAT   ,
    low      FLOAT   ,
    close    FLOAT   ,
    vol      FLOAT   ,

    PRIMARY KEY (pair, exchange, time)
);