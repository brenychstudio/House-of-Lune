CREATE TABLE shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  service_level text NOT NULL CHECK (service_level IN ('STANDARD', 'EXPRESS')),
  state text NOT NULL DEFAULT 'PENDING' CHECK (state IN ('PENDING', 'LABEL_CREATED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
  provider text,
  provider_reference text UNIQUE,
  tracking_reference text,
  insured boolean NOT NULL DEFAULT true,
  signature_required boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE shipment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES shipments(id) ON DELETE RESTRICT,
  event_type text NOT NULL,
  occurred_at timestamptz NOT NULL,
  correlation_id text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TRIGGER shipment_events_immutable
BEFORE UPDATE OR DELETE ON shipment_events
FOR EACH ROW EXECUTE FUNCTION reject_immutable_mutation();

CREATE TABLE returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  order_item_id uuid NOT NULL REFERENCES order_items(id) ON DELETE RESTRICT,
  state text NOT NULL DEFAULT 'REQUESTED' CHECK (state IN (
    'REQUESTED', 'AUTHORIZED', 'IN_TRANSIT', 'RECEIVED', 'INSPECTED',
    'REFUNDED', 'EXCHANGED', 'SERVICE', 'REJECTED'
  )),
  policy_revision text NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE return_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  return_id uuid NOT NULL REFERENCES returns(id) ON DELETE RESTRICT,
  event_type text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_id text NOT NULL,
  correlation_id text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TRIGGER return_events_immutable
BEFORE UPDATE OR DELETE ON return_events
FOR EACH ROW EXECUTE FUNCTION reject_immutable_mutation();

CREATE TABLE service_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  physical_instance_id uuid NOT NULL REFERENCES physical_instances(id) ON DELETE RESTRICT,
  kind text NOT NULL CHECK (kind IN ('RESTORATION', 'REPAIR', 'REPLACEMENT', 'FIT_ADJUSTMENT', 'OTHER')),
  state text NOT NULL DEFAULT 'OPEN' CHECK (state IN ('OPEN', 'INSPECTION', 'APPROVED', 'IN_SERVICE', 'COMPLETED', 'CLOSED')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE service_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_case_id uuid NOT NULL REFERENCES service_cases(id) ON DELETE RESTRICT,
  event_type text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_id text NOT NULL,
  correlation_id text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TRIGGER service_events_immutable
BEFORE UPDATE OR DELETE ON service_events
FOR EACH ROW EXECUTE FUNCTION reject_immutable_mutation();

CREATE TABLE warranty_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  physical_instance_id uuid NOT NULL REFERENCES physical_instances(id) ON DELETE RESTRICT,
  coverage_basis text NOT NULL CHECK (coverage_basis IN ('LEGAL_RIGHT', 'BRENYCH_WARRANTY', 'PAID_AFTERCARE')),
  state text NOT NULL DEFAULT 'SUBMITTED' CHECK (state IN ('SUBMITTED', 'INSPECTION', 'APPROVED', 'REJECTED', 'RESOLVED')),
  decision_reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
