from django.db import models
from django.conf import settings
import uuid

User = settings.AUTH_USER_MODEL


class BaseProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="%(class)ss",  # Auto becomes studentprofiles, instructorprofiles, staffprofiles
    )

    organization = models.ForeignKey(
        "organizations.Organization",
        on_delete=models.CASCADE,
        related_name="%(class)ss",  # Auto becomes studentprofiles, instructorprofiles, staffprofiles
    )

    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50)

    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)

    gender = models.CharField(
        max_length=10,
        choices=[
            ("male", "Male"),
            ("female", "Female"),
            ("other", "Other"),
        ],
        blank=True,
    )

    address = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to="profiles/", null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class StudentProfile(BaseProfile):
    enrollment_id = models.CharField(max_length=30)
    current_level = models.CharField(max_length=50)
    section = models.CharField(max_length=10, blank=True)

    admission_date = models.DateField(null=True, blank=True)

    guardian_name = models.CharField(max_length=100, blank=True)
    guardian_phone = models.CharField(max_length=20, blank=True)
    guardian_email = models.EmailField(blank=True)

    class Meta:
        unique_together = ("organization", "enrollment_id")
        verbose_name_plural = "Student Profiles"

    def __str__(self):
        return f"Student: {self.user.email}"


class InstructorProfile(BaseProfile):
    employee_id = models.CharField(max_length=30)
    specialization = models.CharField(max_length=100)
    qualification = models.CharField(max_length=100, blank=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    joining_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ("organization", "employee_id")
        verbose_name_plural = "Instructor Profiles"

    def __str__(self):
        return f"Instructor: {self.user.email}"


class StaffProfile(BaseProfile):
    employee_id = models.CharField(max_length=30)
    designation = models.CharField(max_length=100)
    department = models.CharField(max_length=100, blank=True)
    joining_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ("organization", "employee_id")
        verbose_name_plural = "Staff Profiles"

    def __str__(self):
        return f"Staff: {self.user.email}"
