CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (email = lower(btrim(email)) AND email LIKE '%@%'),
  display_name text,
  account_state text NOT NULL DEFAULT 'GUEST' CHECK (account_state IN ('GUEST', 'INVITED', 'ACTIVE', 'DISABLED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER customers_set_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE customer_identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  identity_type text NOT NULL CHECK (identity_type IN ('VERIFIED_EMAIL', 'PASSWORDLESS_SUBJECT', 'PASSKEY')),
  identity_value text NOT NULL,
  verified_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (identity_type, identity_value)
);

CREATE TABLE addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  kind text NOT NULL CHECK (kind IN ('SHIPPING', 'BILLING')),
  recipient_name text NOT NULL,
  line_1 text NOT NULL,
  line_2 text,
  city text NOT NULL,
  region text,
  postal_code text NOT NULL,
  country_code char(2) NOT NULL CHECK (country_code ~ '^[A-Z]{2}$'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE price_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market market_code NOT NULL,
  currency currency_code NOT NULL,
  revision text NOT NULL UNIQUE CHECK (length(btrim(revision)) > 0),
  state text NOT NULL DEFAULT 'DRAFT' CHECK (state IN ('DRAFT', 'ACTIVE', 'RETIRED')),
  effective_from timestamptz NOT NULL,
  effective_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (market_currency_is_valid(market, currency)),
  CHECK (effective_until IS NULL OR effective_until > effective_from)
);

CREATE UNIQUE INDEX one_active_price_book_per_market
ON price_books (market) WHERE state = 'ACTIVE';

CREATE TABLE price_book_entries (
  price_book_id uuid NOT NULL REFERENCES price_books(id) ON DELETE RESTRICT,
  variant_id uuid NOT NULL REFERENCES variants(id) ON DELETE RESTRICT,
  unit_price_minor bigint NOT NULL CHECK (unit_price_minor >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (price_book_id, variant_id)
);
