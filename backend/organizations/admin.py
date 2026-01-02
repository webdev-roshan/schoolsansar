from django.contrib import admin
from django_tenants.admin import TenantAdminMixin
from django.db import connection
from .models import Organization, Domain


class GlobalOnlyAdmin(admin.ModelAdmin):
    """
    Ensures that models meant for the SaaS Owner (Public Schema)
    do not leak into the School/Tenant Admin panels.
    """

    def has_module_permission(self, request):
        return connection.schema_name == "public"

    def has_view_permission(self, request, obj=None):
        return connection.schema_name == "public"

    def has_add_permission(self, request):
        return connection.schema_name == "public"

    def has_change_permission(self, request, obj=None):
        return connection.schema_name == "public"

    def has_delete_permission(self, request, obj=None):
        return connection.schema_name == "public"


@admin.register(Organization)
class OrganizationAdmin(TenantAdminMixin, GlobalOnlyAdmin):
    list_display = ("name", "schema_name", "is_active", "created_at")
    search_fields = ("name", "schema_name")
    list_filter = ("is_active",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(Domain)
class DomainAdmin(GlobalOnlyAdmin):
    list_display = ("domain", "tenant", "is_primary")
    search_fields = ("domain", "tenant__name")
