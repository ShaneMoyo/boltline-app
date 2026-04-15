#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until pg_isready -h "${DB_HOST:-postgres}" -U "${DB_USER:-boltline}" > /dev/null 2>&1; do
  sleep 1
done
echo "Database is ready."

echo "Running database migrations..."
cd /app && pnpm --filter @boltline/api exec prisma migrate deploy

echo "Starting API server..."
if [ "$NODE_ENV" = "production" ]; then
  exec node apps/api/dist/index.js
else
  exec pnpm --filter @boltline/api dev
fi
