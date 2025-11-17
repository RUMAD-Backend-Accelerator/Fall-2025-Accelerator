
-- Demonstration script: run this inside psql after the container is up.
-- psql "postgresql://postgres:postgres@localhost:5433/rlsdemo"
-- Then: \i sql/demo.sql

SET search_path = app, public;

\echo ''
\echo '==== Base table (for instructor visibility only) ===='
\echo 'This shows all rows in the shared table (not subject to RLS if you are superuser).'
TABLE orders;

\echo ''
\echo '==== Tenant A session context ===='
-- Set session tenant to A (this is the only session-specific step your app would need)
SET app.tenant = 'A';

\echo 'Visible to Tenant A (RLS applies automatically):'
SELECT order_id, tenant, customer, amount, status FROM orders ORDER BY order_id;

\echo ''
\echo 'Tenant A tries to insert a row for Tenant A -> allowed'
INSERT INTO orders (tenant, customer, amount, status) VALUES ('A','Ariana', 150, 'pending') RETURNING *;

\echo ''
\echo 'Tenant A tries to insert a row for Tenant B -> blocked by RLS (WITH CHECK)'
-- Expect: ERROR due to RLS policy
\set ON_ERROR_STOP off
INSERT INTO orders (tenant, customer, amount, status) VALUES ('B','Boris', 88, 'pending');
\set ON_ERROR_STOP on

\echo ''
\echo 'Tenant A tries to update a Tenant B row -> blocked by RLS (USING)'
-- Try to update order_id that belongs to B (order 3 or 4 from seed data)
\set ON_ERROR_STOP off
UPDATE orders SET status = 'shipped' WHERE order_id = 3;
\set ON_ERROR_STOP on

\echo ''
\echo 'Tenant A updates its own row -> allowed'
UPDATE orders SET status = 'shipped' WHERE tenant = 'A' AND status = 'pending' RETURNING *;

\echo ''
\echo '==== Switch to Tenant B context ===='
RESET app.tenant;       -- clear for clarity (optional)
SET app.tenant = 'B';

\echo 'Visible to Tenant B (note: A rows are invisible)'
SELECT order_id, tenant, customer, amount, status FROM orders ORDER BY order_id;

\echo ''
\echo 'Tenant B tries to delete a Tenant A row -> blocked'
\set ON_ERROR_STOP off
DELETE FROM orders WHERE tenant = 'A';
\set ON_ERROR_STOP on

\echo ''
\echo 'Tenant B deletes its own pending order -> allowed'
DELETE FROM orders WHERE tenant = 'B' AND status = 'pending' RETURNING *;

\echo ''
\echo '==== Summary check as superuser (instructor): ===='
-- (If you are using the postgres superuser, you may see all rows regardless of RLS)
RESET app.tenant;
TABLE orders;
