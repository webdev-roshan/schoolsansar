from rest_framework import viewsets, permissions
from .models import Student, AcademicHistory, StudentLevel
from .serializers import (
    StudentSerializer,
    AcademicHistorySerializer,
    StudentLevelSerializer,
)
from roles.permissions import HasPermission


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().select_related("profile")
    serializer_class = StudentSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated(), HasPermission("view_student")]
        return [permissions.IsAuthenticated(), HasPermission("manage_students")]


class AcademicHistoryViewSet(viewsets.ModelViewSet):
    queryset = AcademicHistory.objects.all()
    serializer_class = AcademicHistorySerializer
    permission_classes = [permissions.IsAuthenticated, HasPermission("manage_students")]


class StudentLevelViewSet(viewsets.ModelViewSet):
    queryset = StudentLevel.objects.all()
    serializer_class = StudentLevelSerializer
    permission_classes = [permissions.IsAuthenticated, HasPermission("manage_students")]
