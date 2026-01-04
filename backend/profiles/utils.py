from django.db import connection
from organizations.models import Organization
from accounts.models import User
from .models import Profile
from django_tenants.utils import tenant_context


def get_global_audit_results():
    """
    Performs a platform-wide scan across all tenants.
    Returns a dictionary of findings.
    """
    valid_user_ids = set(User.objects.values_list("id", flat=True))
    tenants = Organization.objects.exclude(schema_name="public")

    findings = {}

    for tenant in tenants:
        with tenant_context(tenant):
            orphans = Profile.objects.exclude(user_id__in=valid_user_ids).filter(
                user_id__isnull=False
            )
            unlinked = Profile.objects.filter(user_id__isnull=True)

            findings[tenant.schema_name] = {
                "name": tenant.name,
                "orphan_count": orphans.count(),
                "unlinked_count": unlinked.count(),
                "orphan_ids": list(orphans.values_list("id", flat=True)),
                "unlinked_ids": list(unlinked.values_list("id", flat=True)),
            }

    return findings


def cleanup_orphans_for_tenant(tenant_schema):
    """Deletes critical orphans for a specific tenant."""
    valid_user_ids = set(User.objects.values_list("id", flat=True))
    tenant = Organization.objects.get(schema_name=tenant_schema)

    with tenant_context(tenant):
        orphans = Profile.objects.exclude(user_id__in=valid_user_ids).filter(
            user_id__isnull=False
        )
        count = orphans.count()
        orphans.delete()
        return count
