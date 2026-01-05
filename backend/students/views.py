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
    Optimized to prevent N+1 queries.
    """

    permission_classes = [IsAuthenticated, HasPermission("view_student")]

    def get(self, request):
        from django.apps import apps

        User = apps.get_model("accounts", "User")

        # 1. Fetch Students
        students = Student.objects.filter(
            profile__user_id__isnull=False
        ).select_related("profile")

        # 2. Collect User IDs
        user_ids = [s.profile.user_id for s in students if s.profile.user_id]

        if not user_ids:
            return Response([])

        # 3. Bulk Fetch Users (1 Query)
        users = User.objects.filter(id__in=user_ids)
        user_map = {u.id: u for u in users}

        data = []
        for s in students:
            user = user_map.get(s.profile.user_id)

            if user and user.needs_password_change and user.initial_password_display:
                data.append(
                    {
                        "id": s.id,
                        "full_name": f"{s.profile.first_name} {s.profile.last_name}",
                        "enrollment_id": s.enrollment_id,
                        "username": s.profile.local_username or user.username,
                        "initial_password": user.initial_password_display,
                    }
                )

        return Response(data)


class StudentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH"]:
            return [IsAuthenticated(), HasPermission("change_student")]
        elif self.request.method == "DELETE":
            return [IsAuthenticated(), HasPermission("delete_student")]
        return [IsAuthenticated(), HasPermission("view_student")]

    def get(self, request, pk):
        try:
            student = Student.objects.select_related("profile").get(id=pk)
        except Student.DoesNotExist:
            return Response(
                {"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND
            )

        current = student.enrollments.filter(is_current=True).first()

        # We need parents for the edit form
        parents_data = []
        relations = student.parent_links.select_related("parent__profile").all()
        for rel in relations:
            p_profile = rel.parent.profile
            parents_data.append(
                {
                    "first_name": p_profile.first_name,
                    "last_name": p_profile.last_name,
                    "phone": p_profile.phone,
                    "gender": p_profile.gender,
                    "occupation": rel.parent.occupation,
                    "relation": rel.relation_type,
                    "is_primary": rel.is_primary_contact,
                }
            )

        data = {
            "id": student.id,
            "first_name": student.profile.first_name,
            "middle_name": student.profile.middle_name,
            "last_name": student.profile.last_name,
            "enrollment_id": student.enrollment_id,
            "gender": student.profile.gender,
            "date_of_birth": student.profile.date_of_birth,
            "email": student.profile.user.email if student.profile.user_id else None,
            "phone": student.profile.phone,
            "address": student.profile.address,
            # Academic
            "level": current.level if current else "",
            "section": current.section if current else "",
            "academic_year": current.academic_year if current else "",
            "admission_date": student.admission_date,
            "parents": parents_data,  # Include parents for editing
        }

        # Add previous academic history if exists
        history = student.academic_history.first()
        if history:
            data["previous_school"] = history.previous_school
            data["last_grade_passed"] = history.last_grade_passed

        return Response(data)

    def put(self, request, pk):
        try:
            student = Student.objects.select_related("profile").get(id=pk)
        except Student.DoesNotExist:
            return Response(
                {"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = StudentEnrollmentSerializer(
            student, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Student updated successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @transaction.atomic
    def delete(self, request, pk):
        try:
            student = Student.objects.select_related("profile").get(id=pk)
        except Student.DoesNotExist:
            return Response(
                {"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND
            )

        user_id = student.profile.user_id

        # Profile deletion handling
        # Since 'profile' is OneToOne on Student model with CASCADE, deleting student *might* not delete profile
        # if the FK is on Student. We must check Student model definition.
        # Student model: profile = OneToOneField("profiles.Profile", ...)
        # So Student -> Profile.
        # Deleting Student does NOT cascade to Profile.
        # We must delete Profile explicitly.
        profile = student.profile

        student.delete()
        profile.delete()

        if user_id:
            from django.apps import apps
            from django.db import connection

            User = apps.get_model("accounts", "User")
            UserRole = apps.get_model("roles", "UserRole")

            # Remove specific role for this tenant
            UserRole.objects.filter(
                user__id=user_id,
                role__slug="student",
                organization=connection.tenant,
            ).delete()

            # Check for orphans - if user has NO other roles in ANY organization
            if not UserRole.objects.filter(user__id=user_id).exists():
                try:
                    User.objects.get(id=user_id).delete()
                except User.DoesNotExist:
                    pass

        return Response(status=status.HTTP_204_NO_CONTENT)
