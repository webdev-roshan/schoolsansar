from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
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
        students = Student.objects.select_related("profile").all()
        # Simple listing for now
        data = []
        for s in students:
            # Finding current level
            current = s.enrollments.filter(is_current=True).first()
            data.append(
                {
                    "id": s.id,
                    "full_name": f"{s.profile.first_name} {s.profile.last_name}",
                    "enrollment_id": s.enrollment_id,
                    "level": current.level if current else "N/A",
                    "section": current.section if current else "N/A",
                    "status": s.status,
                }
            )
        return Response(data)
