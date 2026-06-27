#!/bin/bash
set -e

echo "=== Viducate Backend Starting ==="

echo "Waiting for database..."
python -c "
import time, sys, os
import sqlalchemy

for i in range(30):
    try:
        engine = sqlalchemy.create_engine(os.getenv('DATABASE_URL'))
        with engine.connect() as conn:
            conn.execute(sqlalchemy.text('SELECT 1'))
        print('Database is ready!')
        sys.exit(0)
    except Exception as e:
        print(f'Attempt {i+1}/30: DB not ready yet... {e}')
        time.sleep(2)

print('ERROR: Database never became ready')
sys.exit(1)
"

echo "Creating tables..."
python -m app.db.create_tables

echo "Starting FastAPI server..."
exec uvicorn app.main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --workers 1 \
    --log-level info