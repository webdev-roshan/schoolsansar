from django.db.models.signals import post_save
from django.dispatch import receiver
from django_tenants.utils import tenant_context
from roles.models import UserRole
from organizations.models import Organization
from profiles.models import Profile, InstitutionProfile
from django.apps import apps


@receiver(post_save, sender=UserRole)
def create_profile_for_role(sender, instance, created, **kwargs):
    if not created or not instance.is_active:
        return

    user = instance.user
    org = instance.organization
    role_slug = instance.role.slug

    with tenant_context(org):
        # 0. Ensure InstitutionProfile exists
        InstitutionProfile.objects.get_or_create(organization_id=org.id)

        # SKIP for Students: Student profiles are created manually during admission
        # and linked manually during portal activation.
        # If we let this signal run, it creates a duplicate "New User" profile.
        if role_slug == "student":
            return

        # 1. Ensure the 'Identity' Profile exists
        profile, _ = Profile.objects.get_or_create(
            user_id=user.id,
            defaults={
                "first_name": getattr(user, "first_name", "New"),
                "last_name": getattr(user, "last_name", "User"),
            },
        )

        # 2. Create Role-Specific domain data
        if role_slug == "student":
            Student = apps.get_model("students", "Student")
            Student.objects.get_or_create(
                profile=profile,
                defaults={"enrollment_id": f"STD-{str(user.id)[:8].upper()}"},
            )

        elif role_slug == "instructor":
            StaffMember = apps.get_model("staff", "StaffMember")
            Instructor = apps.get_model("staff", "Instructor")

            staff, _ = StaffMember.objects.get_or_create(
                profile=profile,
                defaults={
                    "employee_id": f"EMP-{str(user.id)[:8].upper()}",
                    "designation": "Instructor",
                },
            )
            Instructor.objects.get_or_create(
                staff_member=staff, defaults={"specialization": "General"}
            )

        elif role_slug == "staff" or role_slug == "owner":
            StaffMember = apps.get_model("staff", "StaffMember")
            StaffMember.objects.get_or_create(
                profile=profile,
                defaults={
                    "employee_id": f"EMP-{str(user.id)[:8].upper()}",
                    "designation": (
                        "Owner / Administrator" if role_slug == "owner" else "Staff"
                    ),
                },
            )
