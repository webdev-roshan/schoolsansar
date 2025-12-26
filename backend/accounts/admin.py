from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from roles.models import UserRole


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "is_staff", "is_active", "created_at")
    list_filter = ("is_staff", "is_active")
    search_fields = ("email",)
    ordering = ("email",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_staff",
                    "is_active",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "created_at", "updated_at")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2", "is_staff", "is_active"),
            },
        ),
    )


# Optional: Inline UserRoles in User admin
class UserRoleInline(admin.TabularInline):
    model = UserRole
    extra = 1


UserAdmin.inlines = [UserRoleInline]
