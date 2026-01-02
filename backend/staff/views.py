from rest_framework import viewsets, permissions
from .models import StaffMember, Instructor
from .serializers import StaffMemberSerializer, InstructorSerializer
from roles.permissions import HasPermission


class StaffMemberViewSet(viewsets.ModelViewSet):
    queryset = StaffMember.objects.all().select_related("profile")
    serializer_class = StaffMemberSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated(), HasPermission("view_staff")]
        return [permissions.IsAuthenticated(), HasPermission("manage_staff")]


class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all().select_related("staff_member__profile")
    serializer_class = InstructorSerializer
    permission_classes = [permissions.IsAuthenticated, HasPermission("manage_staff")]
