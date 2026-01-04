import os
import django
from django.db import connection

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from organizations.models import Organization, Domain


def create_public_tenant():
    print("Checking for public tenant...")

    # Ensuring public schema exists in DB (usually does if migrations ran)
    with connection.cursor() as cursor:
        cursor.execute("CREATE SCHEMA IF NOT EXISTS public")

    # 1. Create the Public Tenant if it doesn't exist
    public_tenant, created = Organization.objects.get_or_create(
        schema_name="public", defaults={"name": "Public Schema", "is_active": True}
    )

    if created:
        print(f"Created public tenant: {public_tenant.name}")
    else:
        print(f"Public tenant already exists: {public_tenant.name}")

    # 2. Add the localhost domain to the public tenant
    domain, created = Domain.objects.get_or_create(
        domain="localhost", tenant=public_tenant, defaults={"is_primary": True}
    )

    if created:
        print(f"Associated domain 'localhost' with public tenant.")
    else:
        print(f"Domain 'localhost' already associated with public tenant.")

    # 3. Create Superuser (Public Schema)
    from accounts.models import User
    from decouple import config

    superuser_email = config("SUPERUSER_EMAIL", default=None)
    superuser_password = config("SUPERUSER_PASSWORD", default=None)

    if superuser_email and superuser_password:
        # For superuser, we use the email as the username during dev seeding
        username = superuser_email.split("@")[0]

        user = User.objects.filter(username=username).first()
        if not user:
            print(f"Creating superuser: {username} ({superuser_email})")
            User.objects.create_superuser(
                username=username, email=superuser_email, password=superuser_password
            )
        else:
            print(f"Superuser {username} already exists.")
            # Ensure password is correct for dev convenience
            user.set_password(superuser_password)
            user.save()
    else:
        print(
            "SUPERUSER_EMAIL or SUPERUSER_PASSWORD not found in .env, skipping superuser creation."
        )


if __name__ == "__main__":
    create_public_tenant()
