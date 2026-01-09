from django.db import models
import uuid


class Program(models.Model):
    """
    Broad academic stream or program (e.g. High School, Bachelors in CS, A-Levels).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    code = models.CharField(
        max_length=20, unique=True, help_text="Short code e.g. 'HS', 'BSC'"
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.code})"


class AcademicLevel(models.Model):
    """
    Horizontal level within a program (e.g. Grade 10, Semester 1).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.ForeignKey(
        Program, on_delete=models.CASCADE, related_name="levels"
    )
    name = models.CharField(max_length=50, help_text="e.g. 'Grade 10', 'Semester 1'")
    order = models.IntegerField(default=1, help_text="For sorting: 1, 2, 3...")

    class Meta:
        ordering = ["program", "order"]
        unique_together = ["program", "name"]

    def __str__(self):
        return f"{self.program.code} - {self.name}"


class Section(models.Model):
    """
    Physical grouping of student within a level (e.g. Section A, Morning Shift).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    level = models.ForeignKey(
        AcademicLevel, on_delete=models.CASCADE, related_name="sections"
    )
    name = models.CharField(max_length=50, help_text="e.g. 'A', 'Group 1'")
    capacity = models.IntegerField(default=40)

    class Meta:
        unique_together = ["level", "name"]
        ordering = ["level", "name"]

    def __str__(self):
        return f"{self.level.name} - {self.name}"


class Subject(models.Model):
    """
    Subject definition for a specific level (e.g. Mathematics for Grade 10).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    level = models.ForeignKey(
        AcademicLevel, on_delete=models.CASCADE, related_name="subjects"
    )
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, help_text="Course code e.g. MTH101")
    credits = models.DecimalField(max_digits=4, decimal_places=1, default=1.0)
    is_elective = models.BooleanField(default=False)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ["level", "code"]

    def __str__(self):
        return f"{self.code} - {self.name}"


class SubjectAssignment(models.Model):
    """
    Mapping of a Subject to a specific Section and Instructor.
    This defines 'Who teaches What to Whom'.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    section = models.ForeignKey(
        Section, on_delete=models.CASCADE, related_name="assignments"
    )
    subject = models.ForeignKey(
        Subject, on_delete=models.CASCADE, related_name="assignments"
    )
    instructor = models.ForeignKey(
        "staff.Instructor",
        on_delete=models.SET_NULL,
        null=True,
        related_name="assignments",
    )

    class Meta:
        # A section normally has one main teacher for a specific subject
        unique_together = ["section", "subject"]

    def __str__(self):
        return f"{self.subject.code} in {self.section} by {self.instructor}"
