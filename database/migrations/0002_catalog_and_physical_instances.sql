CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text NOT NULL CHECK (length(btrim(name)) > 0),
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'ARCHIVED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER products_set_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  sku text NOT NULL UNIQUE CHECK (sku ~ '^[A-Z0-9]+(?:-[A-Z0-9]+)+$'),
  finish text NOT NULL CHECK (length(btrim(finish)) > 0),
  fulfillment_mode fulfillment_mode NOT NULL,
  active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER variants_set_updated_at
BEFORE UPDATE ON variants
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE editions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid NOT NULL REFERENCES variants(id) ON DELETE RESTRICT,
  edition_number integer NOT NULL,
  edition_size integer NOT NULL,
  state text NOT NULL DEFAULT 'AVAILABLE' CHECK (state IN ('AVAILABLE', 'RESERVED', 'ALLOCATED')),
  reserved_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (variant_id, edition_number),
  UNIQUE (id, variant_id),
  CHECK (edition_size > 0 AND edition_number BETWEEN 1 AND edition_size),
  CHECK ((state = 'RESERVED' AND reserved_until IS NOT NULL) OR (state <> 'RESERVED'))
);

CREATE TABLE physical_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid NOT NULL REFERENCES variants(id) ON DELETE RESTRICT,
  edition_id uuid,
  identity_code text NOT NULL UNIQUE CHECK (identity_code ~ '^BR-[A-Z0-9]+-[A-Z0-9]+-[0-9]{3,}$'),
  design_revision_id text NOT NULL CHECK (length(btrim(design_revision_id)) > 0),
  finish_revision_id text NOT NULL CHECK (length(btrim(finish_revision_id)) > 0),
  fit_revision_id text NOT NULL CHECK (length(btrim(fit_revision_id)) > 0),
  qc_state text NOT NULL DEFAULT 'PENDING' CHECK (qc_state IN ('PENDING', 'PASSED', 'FAILED')),
  manufactured_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (edition_id),
  FOREIGN KEY (edition_id, variant_id) REFERENCES editions(id, variant_id) ON DELETE RESTRICT
);
