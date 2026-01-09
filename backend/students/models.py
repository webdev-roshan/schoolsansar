from django.db import models
import uuid


class Student(models.Model):
    """
    Academic Domain: Stores data specific to a person's life as a student.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.OneToOneField(
        "profiles.Profile", on_delete=models.CASCADE, related_name="student_record"
    )

    enrollment_id = models.CharField(max_length=50, unique=True)
    admission_date = models.DateField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ("active", "Active"),
            ("inactive", "Inactive"),
            ("graduated", "Graduated"),
            ("withdrawn", "Withdrawn"),
        ],
        default="active",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(
                fields=["status", "admission_date"], name="student_status_date_idx"
            ),
        ]

    def __str__(self):
        return f"{self.profile.first_name} - {self.enrollment_id}"


class AcademicHistory(models.Model):
    """
    Stores previous schooling information.
    """

    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name="academic_history"
    )
    previous_school = models.CharField(max_length=255)
    last_grade_passed = models.CharField(max_length=50)
    completion_year = models.IntegerField(null=True, blank=True)
    remarks = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Academic Histories"


class StudentLevel(models.Model):
    """
    Tracks which level (Grade/Class) and section a student is in for a given year.
    """

    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name="enrollments"
    )
    # Link to the Academic Structure
    level = models.ForeignKey(
        "academics.AcademicLevel",
        on_delete=models.PROTECT,
        related_name="student_enrollments",
        null=True,  # Temporarily null for migration safety if needed, or strict if new
    )
    section = models.ForeignKey(
        "academics.Section",
        on_delete=models.SET_NULL,
        related_name="student_enrollments",
        null=True,
        blank=True,
    )

    academic_year = models.CharField(max_length=20)  # e.g., 2081 or 2024
    is_current = models.BooleanField(default=True)

    class Meta:
        unique_together = ("student", "academic_year")
