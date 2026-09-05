CREATE TABLE inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid NOT NULL UNIQUE REFERENCES variants(id) ON DELETE RESTRICT,
  on_hand integer NOT NULL DEFAULT 0 CHECK (on_hand >= 0),
  reserved integer NOT NULL DEFAULT 0 CHECK (reserved >= 0 AND reserved <= on_hand),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE capacity_windows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid NOT NULL REFERENCES variants(id) ON DELETE RESTRICT,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  total_units integer NOT NULL CHECK (total_units >= 0),
  reserved_units integer NOT NULL DEFAULT 0 CHECK (reserved_units >= 0 AND reserved_units <= total_units),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at),
  UNIQUE (variant_id, starts_at, ends_at)
);

CREATE TABLE capacity_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  capacity_window_id uuid NOT NULL REFERENCES capacity_windows(id) ON DELETE RESTRICT,
  cart_id uuid REFERENCES carts(id) ON DELETE RESTRICT,
  order_id uuid REFERENCES orders(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  state text NOT NULL DEFAULT 'ACTIVE' CHECK (state IN ('ACTIVE', 'RELEASED', 'CONVERTED', 'EXPIRED')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (cart_id IS NOT NULL OR order_id IS NOT NULL)
);

CREATE TABLE production_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_family text NOT NULL,
  revision text NOT NULL,
  stages jsonb NOT NULL CHECK (jsonb_typeof(stages) = 'array' AND jsonb_array_length(stages) > 0),
  lead_time_days integer NOT NULL CHECK (lead_time_days > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_family, revision)
);

CREATE TABLE production_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL UNIQUE REFERENCES order_items(id) ON DELETE RESTRICT,
  recipe_id uuid NOT NULL REFERENCES production_recipes(id) ON DELETE RESTRICT,
  physical_instance_id uuid UNIQUE REFERENCES physical_instances(id) ON DELETE RESTRICT,
  state text NOT NULL DEFAULT 'QUEUED' CHECK (state IN (
    'QUEUED', 'MATERIAL_PREP', 'FABRICATION', 'CLEANUP', 'FINISHING', 'ASSEMBLY_FIT',
    'QUALITY_CONTROL', 'RETURNED_TO_FINISHING', 'READY_FOR_PACKAGING', 'PACKAGED', 'READY_TO_SHIP'
  )),
  promised_ready_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE production_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  production_order_id uuid NOT NULL REFERENCES production_orders(id) ON DELETE RESTRICT,
  event_type text NOT NULL,
  from_state text,
  to_state text NOT NULL,
  actor_id text NOT NULL,
  correlation_id text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  details jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TRIGGER production_events_immutable
BEFORE UPDATE OR DELETE ON production_events
FOR EACH ROW EXECUTE FUNCTION reject_immutable_mutation();
