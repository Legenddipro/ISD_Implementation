#!/bin/bash
set -e

echo "⏳ Waiting for PostgreSQL to be ready..."
# Wait for postgres to accept connections
for i in $(seq 1 30); do
  python -c "
from sqlalchemy import create_engine, text
import os
engine = create_engine(os.getenv('DATABASE_URL'))
with engine.connect() as conn:
    conn.execute(text('SELECT 1'))
print('PostgreSQL is ready!')
" 2>/dev/null && break
  echo "  Attempt $i/30 — waiting 2s..."
  sleep 2
done

echo "🔄 Running Alembic migrations..."
alembic upgrade head

echo "🌱 Seeding database (if empty)..."
python -c "
from database import SessionLocal
from models.category import Category

db = SessionLocal()
count = db.query(Category).count()
db.close()

if count == 0:
    print('  Database is empty — running seed...')
    from seed import seed
    seed()
else:
    print(f'  Database already has {count} categories — skipping seed.')
"

echo "🚀 Starting FastAPI server..."
# UPDATED: Use dynamic $PORT and removed --reload for production
exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}"