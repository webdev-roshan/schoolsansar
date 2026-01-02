from django.db import connection


def cleanup_public_schema():
    with connection.cursor() as cursor:
        # Tables to search for in public schema that shouldn't be there
        prefixes = ["profiles_", "students_", "staff_", "families_"]

        cursor.execute(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
        )
        all_tables = [row[0] for row in cursor.fetchall()]

        to_drop = [
            table for table in all_tables if any(table.startswith(p) for p in prefixes)
        ]

        print(f"Found ghost tables in public schema: {to_drop}")

        for table in to_drop:
            print(f"Dropping table {table} from public schema...")
            cursor.execute(f'DROP TABLE IF EXISTS public."{table}" CASCADE')

    print("Cleanup complete.")


if __name__ == "__main__":
    import os
    import django

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    django.setup()
    cleanup_public_schema()
