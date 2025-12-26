from django.db.models.signals import post_save
from django.dispatch import receiver
from roles.models import UserRole
from .models import StudentProfile, InstructorProfile, StaffProfile


@receiver(post_save, sender=UserRole)
def create_profile_for_role(sender, instance, created, **kwargs):
    if not created or not instance.is_active:
        return

    user = instance.user
    org = instance.organization
    role_slug = instance.role.slug

    if role_slug == "student":
        StudentProfile.objects.get_or_create(
            user=user,
            organization=org,
            defaults={"enrollment_id": f"STD-{user.id}"},
        )

    elif role_slug == "teacher":
        InstructorProfile.objects.get_or_create(
            user=user,
            organization=org,
            defaults={"employee_id": f"EMP-{user.id}"},
        )

    elif role_slug == "staff":
        StaffProfile.objects.get_or_create(
            user=user,
            organization=org,
            defaults={"employee_id": f"EMP-{user.id}"},
        )
