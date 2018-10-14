-- This file should undo anything in `up.sql`

DROP AGGREGATE first_slow(ANYELEMENT);
DROP AGGREGATE last_slow(ANYELEMENT);

DROP FUNCTION first_agg_slow;
DROP FUNCTION last_agg_slow;