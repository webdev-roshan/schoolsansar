from django.db.models.signals import pre_delete
from django.dispatch import receiver
from .models import User
from organizations.models import Organization
from django_tenants.utils import tenant_context
from django.apps import apps
from django.db import connection


@receiver(pre_delete, sender=User)
def cleanup_user_tenant_data(sender, instance, **kwargs):
    """
    Called BEFORE a User is deleted.
    Goes through every school and manually wipes their Identity
    so no orphaned data is left behind.
    """
    # 1. Get all school tenants (Filter out 'public' and others)
    tenants = Organization.objects.exclude(schema_name="public").all()
    user_id = instance.id

    for tenant in tenants:
        with tenant_context(tenant):
            try:
                # Try to get the Profile model safely
                Profile = apps.get_model("profiles", "Profile")
                # Delete the profile manually.
                # This will trigger cascades to Students/Staff in this tenant.
                Profile.objects.filter(user_id=user_id).delete()
            except Exception as e:
                # Silent skip if tenant doesn't have profiles app
                continue
