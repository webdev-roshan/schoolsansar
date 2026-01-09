from rest_framework import viewsets, permissions
from .models import Program, AcademicLevel, Section, Subject, SubjectAssignment
from .serializers import (
    ProgramSerializer,
    AcademicLevelSerializer,
    SectionSerializer,
    SubjectSerializer,
    SubjectAssignmentSerializer,
)
from roles.permissions import HasPermission


class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all().prefetch_related("levels__sections")
    serializer_class = ProgramSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated(), HasPermission("view_program")]
        if self.action == "create":
            return [permissions.IsAuthenticated(), HasPermission("add_program")]
        if self.action in ["update", "partial_update"]:
            return [permissions.IsAuthenticated(), HasPermission("change_program")]
        if self.action == "destroy":
            return [permissions.IsAuthenticated(), HasPermission("delete_program")]
        return [permissions.IsAuthenticated(), HasPermission("view_program")]


class AcademicLevelViewSet(viewsets.ModelViewSet):
    queryset = AcademicLevel.objects.all().select_related("program")
    serializer_class = AcademicLevelSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated(), HasPermission("view_academic_level")]
        if self.action == "create":
            return [permissions.IsAuthenticated(), HasPermission("add_academic_level")]
        if self.action in ["update", "partial_update"]:
            return [
                permissions.IsAuthenticated(),
                HasPermission("change_academic_level"),
            ]
        if self.action == "destroy":
            return [
                permissions.IsAuthenticated(),
                HasPermission("delete_academic_level"),
            ]
        return [permissions.IsAuthenticated(), HasPermission("view_academic_level")]


class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all().select_related("level__program")
    serializer_class = SectionSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated(), HasPermission("view_section")]
        if self.action == "create":
            return [permissions.IsAuthenticated(), HasPermission("add_section")]
        if self.action in ["update", "partial_update"]:
            return [permissions.IsAuthenticated(), HasPermission("change_section")]
        if self.action == "destroy":
            return [permissions.IsAuthenticated(), HasPermission("delete_section")]
        return [permissions.IsAuthenticated(), HasPermission("view_section")]


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().select_related("level")
    serializer_class = SubjectSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated(), HasPermission("view_subject")]
        if self.action == "create":
            return [permissions.IsAuthenticated(), HasPermission("add_subject")]
        if self.action in ["update", "partial_update"]:
            return [permissions.IsAuthenticated(), HasPermission("change_subject")]
        if self.action == "destroy":
            return [permissions.IsAuthenticated(), HasPermission("delete_subject")]
        return [permissions.IsAuthenticated(), HasPermission("view_subject")]


class SubjectAssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = SubjectAssignmentSerializer

    def get_queryset(self):
        queryset = SubjectAssignment.objects.all().select_related(
            "section", "subject", "instructor__staff_member__profile"
        )

        instructor_id = self.request.query_params.get("instructor", None)
        section_id = self.request.query_params.get("section", None)

        if instructor_id:
            # Check if it's an Instructor ID or Staff ID.
            # Note: The model has FK to Instructor.
            queryset = queryset.filter(instructor__id=instructor_id)

        if section_id:
            queryset = queryset.filter(section__id=section_id)

        return queryset

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [
                permissions.IsAuthenticated(),
                HasPermission("view_subject_assignment"),
            ]
        if self.action == "create":
            return [
                permissions.IsAuthenticated(),
                HasPermission("add_subject_assignment"),
            ]
        if self.action in ["update", "partial_update"]:
            return [
                permissions.IsAuthenticated(),
                HasPermission("change_subject_assignment"),
            ]
        if self.action == "destroy":
            return [
                permissions.IsAuthenticated(),
                HasPermission("delete_subject_assignment"),
            ]
        return [permissions.IsAuthenticated(), HasPermission("view_subject_assignment")]
