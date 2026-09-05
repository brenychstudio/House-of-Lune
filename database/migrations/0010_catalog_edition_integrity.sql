-- Serialize scarce configuration at Product scope, not only Variant scope.
CREATE FUNCTION guard_unique_product_edition() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE scarcity text;
BEGIN
  SELECT scarcity_mode INTO scarcity FROM products WHERE id=NEW.product_id FOR UPDATE;
  IF scarcity='UNIQUE_ATELIER' AND NEW.edition_size IS NOT NULL AND EXISTS (
    SELECT 1 FROM variants WHERE product_id=NEW.product_id AND id<>NEW.id AND edition_size IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'One-of-one product already has an edition configuration' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER variants_guard_unique_edition BEFORE INSERT OR UPDATE ON variants
FOR EACH ROW EXECUTE FUNCTION guard_unique_product_edition();

CREATE OR REPLACE FUNCTION guard_edition_configuration() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE configured_size integer; existing_size integer; parent_id uuid; scarcity text; product_status text;
BEGIN
  SELECT product_id INTO parent_id FROM variants WHERE id=NEW.variant_id;
  SELECT scarcity_mode,status INTO scarcity,product_status FROM products WHERE id=parent_id FOR UPDATE;
  SELECT edition_size INTO configured_size FROM variants WHERE id=NEW.variant_id FOR UPDATE;
  SELECT edition_size INTO existing_size FROM editions WHERE variant_id=NEW.variant_id LIMIT 1;
  IF (configured_size IS NOT NULL AND NEW.edition_size<>configured_size)
    OR (existing_size IS NOT NULL AND NEW.edition_size<>existing_size) THEN
    RAISE EXCEPTION 'Edition size differs from variant configuration/history' USING ERRCODE='23514';
  END IF;
  IF product_status='ACTIVE' AND scarcity NOT IN ('LIMITED','UNIQUE_ATELIER') THEN
    RAISE EXCEPTION 'Active non-scarce product cannot have numbered editions' USING ERRCODE='23514';
  END IF;
  IF scarcity='UNIQUE_ATELIER' AND (NEW.edition_size<>1 OR EXISTS (
    SELECT 1 FROM editions e JOIN variants v ON v.id=e.variant_id
    WHERE v.product_id=parent_id AND e.id<>NEW.id
  )) THEN
    RAISE EXCEPTION 'One-of-one product cannot allocate another edition' USING ERRCODE='23514';
  END IF;
  IF TG_OP='UPDATE' AND (NEW.id<>OLD.id OR NEW.variant_id<>OLD.variant_id OR
    NEW.edition_number<>OLD.edition_number OR NEW.edition_size<>OLD.edition_size) THEN
    RAISE EXCEPTION 'Edition identity is immutable' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
