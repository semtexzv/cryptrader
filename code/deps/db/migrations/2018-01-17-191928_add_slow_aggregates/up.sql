-- Create a function that always returns the first non-NULL item
CREATE OR REPLACE FUNCTION public.first_agg_slow(ANYELEMENT, ANYELEMENT)
  RETURNS ANYELEMENT LANGUAGE SQL
IMMUTABLE
PARALLEL SAFE
STRICT AS $$
SELECT $1;
$$;

-- And then wrap an aggregate around it
CREATE AGGREGATE  public.first_slow (
    SFUNC = PUBLIC.first_agg_slow,
    BASETYPE = ANYELEMENT,
    STYPE = ANYELEMENT
);

-- Create a function that always returns the last non-NULL item
CREATE OR REPLACE FUNCTION public.last_agg_slow(ANYELEMENT, ANYELEMENT)
  RETURNS ANYELEMENT LANGUAGE SQL
IMMUTABLE
PARALLEL SAFE
STRICT AS $$
SELECT $2;
$$;

-- And then wrap an aggregate around it
CREATE AGGREGATE public.last_slow (
    SFUNC = PUBLIC.last_agg_slow,
    BASETYPE = ANYELEMENT,
    STYPE = ANYELEMENT
);

