CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated = now();
    RETURN NEW;
END;
$$ language 'plpgsql';


create table if not exists users
(
    id                 integer generated by default as identity primary key,
    name               text,
    email              text                     not null unique,
    password           text                     not null,
    avatar             text,
    is_verified        bool                     not null default false,
    has_verified_email bool                     not null default false,
    created            timestamp with time zone not null default now(),
    updated            timestamp with time zone not null default now()
);

CREATE TRIGGER user_updated
    BEFORE INSERT OR UPDATE
    ON users
    FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();


create table if not exists strategies
(
    id      integer generated by default as identity primary key,
    user_id integer                  not null,
    name    text                     not null,
    body    text                     not null,
    created timestamp with time zone not null default now(),
    updated timestamp with time zone not null default now(),
    foreign key (user_id) references users (id)
);

create trigger strategy_updated
    before insert or update
    on strategies
    for each row
execute procedure update_timestamp();

create table if not exists traders
(
    id         integer generated by default as identity primary key,

    user_id    integer not null,

    name       text    not null,
    exchange   text    not null,
    api_key    text    not null,
    api_secret text    not null,

    foreign key (user_id) references users (id) on delete cascade
);

create table if not exists assignments
(
    pair_id     integer not null,
    user_id     integer not null,

    period      text    not null,
    strategy_id integer not null,

    trader_id   integer,

    primary key (pair_id, user_id),
    foreign key (pair_id) references pairs (id) on delete cascade,
    foreign key (user_id) references users (id) on delete cascade,
    foreign key (strategy_id) references strategies (id) on delete cascade,
    foreign key (trader_id) references traders (id) on delete cascade
);

create table if not exists evaluations
(
    id          uuid                     not null default gen_random_uuid(),
    pair_id     integer                  not null,
    period      text                     not null,

    user_id     integer                  not null,
    strategy_id integer                  not null,

    time        timestamp with time zone not null default now(),

    status      boolean                  not null,
    duration    bigint                   not null default 0,

    ok          text,
    error       text,

    primary key (id),
    foreign key (pair_id) references pairs (id) on delete cascade,
    foreign key (user_id) references users (id) on delete cascade,
    foreign key (strategy_id) references strategies (id) on delete cascade
);

create table if not exists trades
(
    id        uuid                     not null default gen_random_uuid(),
    time      timestamp with time zone not null default now(),

    user_id   integer                  not null,
    trader_id integer                  not null,
    pair_id   integer                  not null,

    buy       boolean                  not null,
    amount    double precision         not null,
    price     double precision         not null,

    status    boolean                  not null,
    ok        text,
    error     text,

    primary key (id),
    foreign key (pair_id) references pairs (id) on delete cascade,
    foreign key (user_id) references users (id) on delete cascade,
    foreign key (trader_id) references traders (id) on delete cascade

)