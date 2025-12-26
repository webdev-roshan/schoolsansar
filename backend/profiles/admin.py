from django.contrib import admin
from .models import StudentProfile, InstructorProfile, StaffProfile


class BaseProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "organization", "first_name", "last_name", "phone")
    search_fields = ("user__email", "first_name", "last_name")
    list_filter = ("organization", "gender")
    readonly_fields = ("created_at", "updated_at")


@admin.register(StudentProfile)
class StudentProfileAdmin(BaseProfileAdmin):
    list_display = BaseProfileAdmin.list_display + (
        "enrollment_id",
        "current_level",
        "section",
        "guardian_name",
        "guardian_email",
    )
    search_fields = BaseProfileAdmin.search_fields + ("enrollment_id", "guardian_name")


@admin.register(InstructorProfile)
class InstructorProfileAdmin(BaseProfileAdmin):
    list_display = BaseProfileAdmin.list_display + (
        "employee_id",
        "specialization",
        "qualification",
        "years_of_experience",
    )
    search_fields = BaseProfileAdmin.search_fields + ("employee_id", "specialization")


@admin.register(StaffProfile)
class StaffProfileAdmin(BaseProfileAdmin):
    list_display = BaseProfileAdmin.list_display + (
        "employee_id",
        "designation",
        "department",
    )
    search_fields = BaseProfileAdmin.search_fields + (
        "employee_id",
        "designation",
        "department",
    )
