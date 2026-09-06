CREATE TABLE passkey_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL,
  credential_id text NOT NULL UNIQUE CHECK (length(btrim(credential_id)) > 0),
  public_key text NOT NULL CHECK (length(btrim(public_key)) > 0),
  sign_count bigint NOT NULL DEFAULT 0 CHECK (sign_count >= 0),
  user_handle uuid NOT NULL,
  transports text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz,
  revoked_at timestamptz,
  FOREIGN KEY (customer_id, user_handle)
    REFERENCES customers(id, webauthn_user_handle) ON DELETE RESTRICT,
  CHECK (last_used_at IS NULL OR last_used_at >= created_at),
  CHECK (revoked_at IS NULL OR revoked_at >= created_at)
);

CREATE INDEX passkey_credentials_customer
ON passkey_credentials (customer_id, created_at);
