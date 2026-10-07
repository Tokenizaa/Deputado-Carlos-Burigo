#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

DB="${ELECTORAL_LOCAL_DB_URL:-postgresql://postgres:postgres@127.0.0.1:54322/postgres}"
RAW="${ELECTORAL_RAW_DIR:-$ROOT/artifacts/electoral/raw}"

psql "$DB" -v ON_ERROR_STOP=1 -f supabase/migrations/20261007170000_create_clean_electoral_model.sql

for YEAR in 2018 2022 2026; do
  case "$YEAR" in
    2018) FILE="$RAW/votacao_candidato_munzona_2018.zip" ;;
    2022) FILE="$RAW/votacao_candidato_munzona_2022.zip" ;;
    2026) FILE="$RAW/votacao_candidato_munzona_2026.zip" ;;
  esac

  test -f "$FILE"
  node scripts/electoral/load-tse-rs.mjs --year "$YEAR" --file "$FILE" --db "$DB"
  node scripts/electoral/validate-tse-rs.mjs --db "$DB"
done
