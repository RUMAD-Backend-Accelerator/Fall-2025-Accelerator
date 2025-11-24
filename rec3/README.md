
# Row-Level Security (RLS) Demo — PostgreSQL

This is a **minimal, self-contained** demo of **Row-Level Security** for multi-tenant isolation on a shared `orders` table.

## What you'll get
- **PostgreSQL 16** via Docker
- A single `orders` table with sample data across tenants **A**, **B**, **C**
- **RLS policies** that restrict:
  - which rows are visible (`SELECT`), and
  - which rows can be modified (`INSERT`, `UPDATE`, `DELETE`)
- A **session-based tenant context** (`SET app.tenant = 'A'`) the engine uses to enforce RLS.

## Quick start

1. **Start the database**

   ```bash
   docker compose up -d
   ```

   This will create a database `rlsdemo` and automatically run the SQL in `./sql/`.

2. **Open a psql shell** (you can use your local psql or exec into the container):

   ```bash
   psql "postgresql://postgres:postgres@localhost:5433/rlsdemo"
   ```

3. **Run the demo script** from `psql` to see RLS in action:

   ```sql
   \i sql/demo.sql
   ```

   Watch how the result sets change for **Tenant A** vs **Tenant B** without changing the base query.

## What to look for in the demo

- **Without RLS** (conceptual): forgetting a `WHERE tenant = ...` would leak **all rows**.
- **With RLS**: the database silently applies the correct row filter based on `app.tenant`.
- **Write protection**: attempts to insert/update “other tenant” rows are **blocked**.
- **Performance note**: RLS predicates rely on indexes (we index `tenant`).

## Files

- `docker-compose.yml` — spins up Postgres
- `sql/init.sql` — schema, data, roles, and RLS policies
- `sql/demo.sql` — walkthrough showing what each tenant can/can’t do
- `scripts/run_demo.sh` — convenience wrapper to run the demo with `psql`

## Clean up

```bash
docker compose down -v
```

This removes the container and the demo data volume.
