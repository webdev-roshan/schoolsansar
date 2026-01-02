from rest_framework import viewsets, permissions
from .models import Parent, StudentParentRelation
from .serializers import ParentSerializer, StudentParentRelationSerializer
from roles.permissions import HasPermission


class ParentViewSet(viewsets.ModelViewSet):
    queryset = Parent.objects.all().select_related("profile")
    serializer_class = ParentSerializer
    permission_classes = [permissions.IsAuthenticated, HasPermission("manage_students")]


class StudentParentRelationViewSet(viewsets.ModelViewSet):
    queryset = StudentParentRelation.objects.all()
    serializer_class = StudentParentRelationSerializer
    permission_classes = [permissions.IsAuthenticated, HasPermission("manage_students")]
