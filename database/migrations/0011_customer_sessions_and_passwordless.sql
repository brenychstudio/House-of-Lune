CREATE TABLE guest_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash char(64) NOT NULL UNIQUE CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  bound_customer_id uuid REFERENCES customers(id) ON DELETE RESTRICT,
  CHECK (expires_at > created_at),
  CHECK (last_seen_at >= created_at)
);

CREATE INDEX guest_sessions_active_lookup
ON guest_sessions (token_hash, expires_at) WHERE revoked_at IS NULL;

CREATE TABLE passwordless_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  purpose text NOT NULL CHECK (purpose IN ('ACCOUNT_ACTIVATION', 'SIGN_IN')),
  token_hash char(64) NOT NULL UNIQUE CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  invalidated_at timestamptz,
  CHECK (consumed_at IS NULL OR consumed_at >= created_at),
  CHECK (invalidated_at IS NULL OR invalidated_at >= created_at),
  CHECK (consumed_at IS NULL OR invalidated_at IS NULL)
);

CREATE UNIQUE INDEX one_open_passwordless_challenge_per_purpose
ON passwordless_challenges (customer_id, purpose)
WHERE consumed_at IS NULL AND invalidated_at IS NULL;

CREATE INDEX passwordless_challenge_exchange
ON passwordless_challenges (token_hash, expires_at)
WHERE consumed_at IS NULL AND invalidated_at IS NULL;

CREATE TABLE passwordless_access_limits (
  scope text NOT NULL CHECK (scope IN ('ADDRESS', 'CALLER')),
  request_hash char(64) NOT NULL CHECK (request_hash ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz NOT NULL,
  request_count integer NOT NULL CHECK (request_count > 0),
  expires_at timestamptz NOT NULL,
  PRIMARY KEY (scope, request_hash),
  CHECK (expires_at > window_started_at)
);

CREATE INDEX passwordless_access_limits_expiry
ON passwordless_access_limits (expires_at);

CREATE TABLE customer_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  token_hash char(64) NOT NULL UNIQUE CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  idle_expires_at timestamptz NOT NULL,
  absolute_expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  revocation_reason text,
  created_from_challenge_id uuid REFERENCES passwordless_challenges(id) ON DELETE RESTRICT,
  CHECK (last_seen_at >= created_at),
  CHECK (absolute_expires_at > created_at),
  CHECK (idle_expires_at <= absolute_expires_at),
  CHECK ((revoked_at IS NULL) = (revocation_reason IS NULL))
);

CREATE INDEX customer_sessions_active_lookup
ON customer_sessions (token_hash, idle_expires_at, absolute_expires_at)
WHERE revoked_at IS NULL;

CREATE INDEX customer_sessions_customer_active
ON customer_sessions (customer_id) WHERE revoked_at IS NULL;
