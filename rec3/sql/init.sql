
-- Initialize schema, sample data, roles, and RLS policies for a multi-tenant Orders demo.

-- 1) Schema
CREATE SCHEMA IF NOT EXISTS app;
SET search_path = app, public;

-- Single shared table
CREATE TABLE IF NOT EXISTS orders (
  order_id   BIGSERIAL PRIMARY KEY,
  tenant     TEXT NOT NULL,
  customer   TEXT NOT NULL,
  amount     NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  status     TEXT NOT NULL CHECK (status IN ('pending','shipped','canceled'))
);

-- Helpful indexes (RLS predicate uses tenant)
CREATE INDEX IF NOT EXISTS idx_orders_tenant ON orders(tenant);

-- 2) Sample data (3 tenants)
INSERT INTO orders (tenant, customer, amount, status) VALUES
('A','Alice', 120, 'shipped'),
('A','Aaron',  75, 'pending'),
('B','Bella',  60, 'shipped'),
('B','Ben',   220, 'pending'),
('C','Chris',  90, 'canceled');

-- 3) Roles (optional: separate login roles for tenants to emphasize least privilege)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tenant_a') THEN
    CREATE ROLE tenant_a LOGIN PASSWORD 'tenant_a';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tenant_b') THEN
    CREATE ROLE tenant_b LOGIN PASSWORD 'tenant_b';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tenant_c') THEN
    CREATE ROLE tenant_c LOGIN PASSWORD 'tenant_c';
  END IF;
END$$;

-- Revoke default wide-open privileges
REVOKE ALL ON SCHEMA app FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA app FROM PUBLIC;

-- Grant minimal privileges to tenant roles (no bypass of RLS)
GRANT USAGE ON SCHEMA app TO tenant_a, tenant_b, tenant_c;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.orders TO tenant_a, tenant_b, tenant_c;

-- 4) Enable RLS
ALTER TABLE app.orders ENABLE ROW LEVEL SECURITY;

-- 5) Row visibility (SELECT policy)
-- Allow viewing rows where orders.tenant matches the session's app.tenant.
-- We use a custom GUC `app.tenant` that the app or user sets per session.
CREATE POLICY rls_orders_select ON app.orders
  FOR SELECT
  USING (tenant = current_setting('app.tenant', true));

-- 6) Row write eligibility
-- INSERTs must set tenant equal to the session tenant.
CREATE POLICY rls_orders_insert ON app.orders
  FOR INSERT
  WITH CHECK (tenant = current_setting('app.tenant', true));

-- UPDATEs may only modify rows that belong to the session tenant,
-- and the updated row must remain within that tenant.
CREATE POLICY rls_orders_update ON app.orders
  FOR UPDATE
  USING (tenant = current_setting('app.tenant', true))
  WITH CHECK (tenant = current_setting('app.tenant', true));

-- DELETEs only allowed within the session tenant.
CREATE POLICY rls_orders_delete ON app.orders
  FOR DELETE
  USING (tenant = current_setting('app.tenant', true));

-- Note: superusers or roles with BYPASSRLS can override these protections;
-- keep such roles restricted in real environments.
