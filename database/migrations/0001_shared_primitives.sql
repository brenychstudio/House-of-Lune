CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE market_code AS ENUM ('EU', 'UK', 'US');
CREATE TYPE currency_code AS ENUM ('EUR', 'GBP', 'USD');
CREATE TYPE fulfillment_mode AS ENUM ('IN_STOCK', 'MADE_TO_ORDER', 'BESPOKE');

CREATE FUNCTION market_currency_is_valid(market market_code, currency currency_code)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT (market = 'EU' AND currency = 'EUR')
      OR (market = 'UK' AND currency = 'GBP')
      OR (market = 'US' AND currency = 'USD');
$$;

CREATE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = clock_timestamp();
  RETURN NEW;
END;
$$;

CREATE FUNCTION reject_immutable_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION '% is append-only and cannot be %', TG_TABLE_NAME, TG_OP
    USING ERRCODE = '55000';
END;
$$;
