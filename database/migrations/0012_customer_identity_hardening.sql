ALTER TABLE customer_identities
  ADD COLUMN provider text;

ALTER TABLE customer_identities
  DROP CONSTRAINT customer_identities_identity_type_check,
  DROP CONSTRAINT customer_identities_identity_type_identity_value_key;

ALTER TABLE customer_identities
  ADD CONSTRAINT customer_identity_type
    CHECK (identity_type IN ('VERIFIED_EMAIL', 'EXTERNAL_SUBJECT', 'PASSWORDLESS_SUBJECT', 'PASSKEY')),
  ADD CONSTRAINT customer_identity_namespace
    CHECK (
      (identity_type = 'EXTERNAL_SUBJECT' AND provider IS NOT NULL AND length(btrim(provider)) > 0)
      OR (identity_type <> 'EXTERNAL_SUBJECT' AND provider IS NULL)
    ),
  ADD CONSTRAINT customer_identity_value_present CHECK (length(btrim(identity_value)) > 0),
  ADD CONSTRAINT verified_email_is_normalized
    CHECK (identity_type <> 'VERIFIED_EMAIL' OR (identity_value = lower(btrim(identity_value)) AND identity_value LIKE '%@%'));

CREATE UNIQUE INDEX deterministic_customer_identity
ON customer_identities (identity_type, COALESCE(provider, ''), identity_value);

ALTER TABLE addresses
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

CREATE TRIGGER addresses_set_updated_at
BEFORE UPDATE ON addresses
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE customers
  ADD COLUMN webauthn_user_handle uuid NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE customers
  ADD CONSTRAINT customers_webauthn_user_handle_key UNIQUE (webauthn_user_handle),
  ADD CONSTRAINT customers_id_webauthn_handle_key UNIQUE (id, webauthn_user_handle);
