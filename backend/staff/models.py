from django.db import models
import uuid


class StaffMember(models.Model):
    """
    Employment Domain: Stores professional and organizational data for staff.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.OneToOneField(
        "profiles.Profile", on_delete=models.CASCADE, related_name="staff_record"
    )

    employee_id = models.CharField(max_length=50, unique=True)
    designation = models.CharField(max_length=100)
    department = models.CharField(max_length=100, blank=True)

    joining_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    # Qualification and background
    qualification = models.TextField(blank=True)
    experience_years = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.profile.first_name} - {self.employee_id} ({self.designation})"


class Instructor(models.Model):
    """
    Extends StaffMember for teaching-specific data.
    """

    staff_member = models.OneToOneField(
        StaffMember, on_delete=models.CASCADE, related_name="instructor_record"
    )
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"Instructor: {self.staff_member.profile.first_name} ({self.specialization})"
