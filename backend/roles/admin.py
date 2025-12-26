from django.contrib import admin
from .models import Role, UserRole

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_system_role", "created_at")
    search_fields = ("name", "slug")
    list_filter = ("is_system_role",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "organization", "is_active", "created_at")
    search_fields = ("user__email", "role__name", "organization__name")
    list_filter = ("role", "organization", "is_active")
    readonly_fields = ("created_at",)
