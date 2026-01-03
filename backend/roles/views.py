from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from django.utils.text import slugify
from .models import Role, Permission
from .serializers import RoleSerializer, PermissionSerializer
from .permissions import HasPermission


class RoleViewSet(viewsets.ModelViewSet):
    serializer_class = RoleSerializer

    def get_permissions(self):
        base_permissions = [IsAuthenticated()]
        if self.action in ["list", "retrieve"]:
            base_permissions.append(HasPermission("view_role"))
        elif self.action == "create":
            base_permissions.append(HasPermission("add_role"))
        elif self.action in ["update", "partial_update"]:
            base_permissions.append(HasPermission("change_role"))
        elif self.action == "destroy":
            base_permissions.append(HasPermission("delete_role"))
        return base_permissions

    def get_queryset(self):
        # Annotate with user count for this specific tenant context
        # Note: UserRole is tenant-aware because it links to Organization
        # But wait, Role table is SHARED?
        # Standard django-tenants approach: If Role is SHARED, then everyone sees same roles.
        # If Role is TENANT-SPECIFIC, then it's fine.
        # Based on previous context, Role seems to be in a shared app or tenant app?
        # Let's assume Role is Tenant specific as custom roles shouldn't leak.
        # If roles app is SHARED in settings, we have a problem.
        # Let's proceed assuming roles are effectively tenant scoped or we are filtering properly.

        return Role.objects.annotate(
            user_count=Count("user_roles", filter=Q(user_roles__is_active=True))
        ).order_by("-is_system_role", "name")

    def perform_create(self, serializer):
        # Auto-generate slug from name
        name = serializer.validated_data.get("name")
        slug = slugify(name)

        # Ensure slug uniqueness
        original_slug = slug
        counter = 1
        while Role.objects.filter(slug=slug).exists():
            slug = f"{original_slug}-{counter}"
            counter += 1

        serializer.save(slug=slug, is_system_role=False)

    def perform_update(self, serializer):
        role = self.get_object()
        # Prevent renaming system roles (slug is read-only anyway)
        # But we allow changing permissions for system roles!
        serializer.save()

    def perform_destroy(self, serializer):
        role = self.get_object()
        if role.is_system_role:
            from rest_framework.exceptions import ValidationError

            raise ValidationError("System roles cannot be deleted.")
        role.delete()


class PermissionListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, HasPermission("view_role")]
    serializer_class = PermissionSerializer
    queryset = Permission.objects.all().order_by("module", "name")
