
#!/usr/bin/env bash
set -euo pipefail

DB_URL=${DB_URL:-"postgresql://postgres:postgres@localhost:5433/rlsdemo"}

echo "Running demo against: $DB_URL"
psql "$DB_URL" -v ON_ERROR_STOP=1 -f sql/demo.sql
