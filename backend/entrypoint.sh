#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# Run migrations
# DEV TIP: Uncomment the next 3 lines and run 'docker compose down -v' to hard-reset migrations
echo "Development Mode: Cleaning old migration files to ensure sync with current models..."
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

echo "Generating fresh migrations..."
python manage.py makemigrations --noinput

echo "Syncing SHARED apps (Public Schema)..."
python manage.py migrate_schemas --shared --noinput

echo "Seeding public tenant..."
python seed_public.py

echo "Syncing TENANT apps (All Schemas)..."
python manage.py migrate_schemas --tenant --noinput

exec "$@"
