ALTER TABLE products
  ADD COLUMN scarcity_mode text NOT NULL DEFAULT 'UNDECIDED'
    CHECK (scarcity_mode IN ('UNDECIDED','CORE','LIMITED','UNIQUE_ATELIER')),
  ADD COLUMN acquisition_mode text NOT NULL DEFAULT 'NOT_FOR_SALE'
    CHECK (acquisition_mode IN ('NOT_FOR_SALE','PURCHASABLE','INQUIRY_ONLY')),
  ADD CONSTRAINT product_activation_profile CHECK (
    (status = 'ACTIVE' OR acquisition_mode = 'NOT_FOR_SALE')
    AND (status <> 'ACTIVE' OR scarcity_mode <> 'UNDECIDED')
  );

-- Existing draft finishes remain labels, not invented machine identities.
ALTER TABLE variants
  ADD COLUMN finish_code text CHECK (finish_code ~ '^[A-Z0-9]+(-[A-Z0-9]+)*$'),
  ADD COLUMN lead_time_min_days integer,
  ADD COLUMN lead_time_max_days integer,
  ADD COLUMN edition_size integer CHECK (edition_size > 0),
  ADD CONSTRAINT variant_finish_activation CHECK (NOT active OR finish_code IS NOT NULL),
  ADD CONSTRAINT variant_lead_time_promise CHECK (
    (lead_time_min_days IS NULL AND lead_time_max_days IS NULL) OR
    (lead_time_min_days IS NOT NULL AND lead_time_max_days IS NOT NULL
      AND lead_time_min_days > 0 AND lead_time_max_days >= lead_time_min_days
      AND fulfillment_mode = 'MADE_TO_ORDER')
  );

CREATE INDEX public_products_by_slug ON products(slug) WHERE status = 'ACTIVE';
CREATE INDEX active_variants_by_product ON variants(product_id) WHERE active;

CREATE FUNCTION guard_catalog_product() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.id <> OLD.id OR NEW.slug <> OLD.slug THEN
    RAISE EXCEPTION 'Product identity is immutable' USING ERRCODE = '23514';
  END IF;
  IF NEW.scarcity_mode <> OLD.scarcity_mode AND EXISTS (
    SELECT 1 FROM editions e JOIN variants v ON v.id=e.variant_id WHERE v.product_id=OLD.id
  ) THEN
    RAISE EXCEPTION 'Scarcity with edition history is immutable' USING ERRCODE = '23514';
  END IF;
  IF NEW.status <> 'ACTIVE' AND EXISTS (SELECT 1 FROM variants WHERE product_id=OLD.id AND active) THEN
    RAISE EXCEPTION 'Deactivate variants before closing product' USING ERRCODE = '23514';
  END IF;
  IF NEW.scarcity_mode IN ('LIMITED','UNIQUE_ATELIER') AND NEW.acquisition_mode='PURCHASABLE'
    AND EXISTS (SELECT 1 FROM variants WHERE product_id=OLD.id AND active AND
      (edition_size IS NULL OR (NEW.scarcity_mode='UNIQUE_ATELIER' AND edition_size<>1))) THEN
    RAISE EXCEPTION 'Active scarce variant requires edition configuration' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER products_guard_commercial BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION guard_catalog_product();

CREATE FUNCTION guard_catalog_variant() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE p products; existing_size integer;
BEGIN
  SELECT * INTO p FROM products WHERE id=NEW.product_id FOR UPDATE;
  IF TG_OP='UPDATE' THEN
    IF NEW.id<>OLD.id OR NEW.product_id<>OLD.product_id OR NEW.sku<>OLD.sku
      OR (OLD.finish_code IS NOT NULL AND NEW.finish_code IS DISTINCT FROM OLD.finish_code) THEN
      RAISE EXCEPTION 'Variant identity is immutable' USING ERRCODE='23514';
    END IF;
    IF NEW.edition_size IS DISTINCT FROM OLD.edition_size AND EXISTS (
      SELECT 1 FROM editions WHERE variant_id=OLD.id
    ) THEN
      RAISE EXCEPTION 'Edition history is immutable' USING ERRCODE='23514';
    END IF;
  END IF;
  IF NEW.active AND p.status<>'ACTIVE' THEN
    RAISE EXCEPTION 'Variant activation requires active product' USING ERRCODE='23514';
  END IF;
  IF NEW.edition_size IS NOT NULL AND (
    p.scarcity_mode NOT IN ('LIMITED','UNIQUE_ATELIER')
    OR (p.scarcity_mode='UNIQUE_ATELIER' AND NEW.edition_size<>1)
  ) THEN
    RAISE EXCEPTION 'Invalid scarcity edition size' USING ERRCODE='23514';
  END IF;
  IF NEW.active AND p.acquisition_mode='PURCHASABLE' AND p.scarcity_mode IN ('LIMITED','UNIQUE_ATELIER')
    AND NEW.edition_size IS NULL THEN
    RAISE EXCEPTION 'Scarce acquisition requires edition configuration' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER variants_guard_commercial BEFORE INSERT OR UPDATE ON variants
FOR EACH ROW EXECUTE FUNCTION guard_catalog_variant();

CREATE FUNCTION guard_edition_configuration() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE configured_size integer;
BEGIN
  SELECT edition_size INTO configured_size FROM variants WHERE id=NEW.variant_id FOR UPDATE;
  IF configured_size IS NOT NULL AND NEW.edition_size<>configured_size THEN
    RAISE EXCEPTION 'Edition size differs from variant configuration' USING ERRCODE='23514';
  END IF;
  IF TG_OP='UPDATE' AND (NEW.id<>OLD.id OR NEW.variant_id<>OLD.variant_id OR
    NEW.edition_number<>OLD.edition_number OR NEW.edition_size<>OLD.edition_size) THEN
    RAISE EXCEPTION 'Edition identity is immutable' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER editions_guard_configuration BEFORE INSERT OR UPDATE ON editions
FOR EACH ROW EXECUTE FUNCTION guard_edition_configuration();
