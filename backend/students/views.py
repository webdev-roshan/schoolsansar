from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from roles.permissions import HasPermission
from .serializers import StudentEnrollmentSerializer
from .models import Student


class StudentEnrollmentView(APIView):
    """
    Unified endpoint for enrolling a new student.
    Handles profile creation, student record, and academic placement.
    """

    permission_classes = [IsAuthenticated, HasPermission("add_student")]

    def post(self, request):
        serializer = StudentEnrollmentSerializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            return Response(
                {
                    "message": "Student enrolled successfully",
                    "enrollment_id": student.enrollment_id,
                    "student_id": student.id,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StudentListView(APIView):
    permission_classes = [IsAuthenticated, HasPermission("view_student")]

    def get(self, request):
        unenrolled_only = request.query_params.get("unenrolled") == "true"

        students = Student.objects.select_related("profile")
        if unenrolled_only:
            students = students.filter(profile__user_id__isnull=True)
        else:
            students = students.all()

        data = []
        for s in students:
            # Finding current level
            current = s.enrollments.filter(is_current=True).first()
            data.append(
                {
                    "id": s.id,
                    "first_name": s.profile.first_name,
                    "middle_name": s.profile.middle_name,
                    "last_name": s.profile.last_name,
                    "full_name": f"{s.profile.first_name} {s.profile.middle_name + ' ' if s.profile.middle_name else ''}{s.profile.last_name}",
                    "enrollment_id": s.enrollment_id,
                    "level": current.level if current else "N/A",
                    "section": current.section if current else "N/A",
                    "status": s.status,
                    "has_account": s.profile.user_id is not None,
                }
            )
        return Response(data)


class PortalActivationView(APIView):
    """
    Creates user accounts for existing student profiles.
    Expects a list of enrollment objects.
    """

    permission_classes = [IsAuthenticated, HasPermission("add_student")]

    @transaction.atomic
    def post(self, request):
        enrollment_list = request.data.get("enrollments", [])
        if not isinstance(enrollment_list, list):
            return Response(
                {"error": "Expected a list of enrollments under the 'enrollments' key"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        results = []
        errors = []

        from .serializers import BulkAccountCreationSerializer

        for index, enrollment_data in enumerate(enrollment_list):
            serializer = BulkAccountCreationSerializer(data=enrollment_data)
            if serializer.is_valid():
                try:
                    user = serializer.save()
                    results.append(
                        {
                            "index": index,
                            "username": user.username,
                            "student_id": enrollment_data["student_id"],
                        }
                    )
                except Exception as e:
                    errors.append({"index": index, "error": str(e)})
            else:
                errors.append({"index": index, "errors": serializer.errors})

        if errors:
            transaction.set_rollback(True)
            return Response(
                {"message": "Portal activation failed", "errors": errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "message": f"Successfully activated portal for {len(results)} students",
                "results": results,
            },
            status=status.HTTP_201_CREATED,
        )


class CredentialDistributionView(APIView):
    """
    Lists students who have been activated but haven't changed their password.
    Includes their initial temporary password.
    """

    permission_classes = [IsAuthenticated, HasPermission("view_student")]

    def get(self, request):
        from django.apps import apps

        User = apps.get_model("accounts", "User")

        # We need to find students whose linked User hasn't changed password
        # This is restricted to the current tenant because Student is a tenant model
        students = Student.objects.filter(
            profile__user_id__isnull=False
        ).select_related("profile")

        data = []
        for s in students:
            # Fetch the global user safely
            try:
                user = User.objects.get(id=s.profile.user_id)
                if user.needs_password_change and user.initial_password_display:
                    data.append(
                        {
                            "id": s.id,
                            "full_name": f"{s.profile.first_name} {s.profile.last_name}",
                            "enrollment_id": s.enrollment_id,
                            "username": s.profile.local_username or user.username,
                            "initial_password": user.initial_password_display,
                        }
                    )
            except User.DoesNotExist:
                continue

        return Response(data)
