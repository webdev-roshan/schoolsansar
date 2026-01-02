from rest_framework import serializers
from .models import Student, AcademicHistory, StudentLevel
from profiles.serializers import ProfileSerializer


class StudentLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentLevel
        fields = "__all__"


class AcademicHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicHistory
        fields = "__all__"


class StudentSerializer(serializers.ModelSerializer):
    profile_details = ProfileSerializer(source="profile", read_only=True)
    current_enrollment = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = (
            "id",
            "profile",
            "profile_details",
            "enrollment_id",
            "admission_date",
            "status",
            "current_enrollment",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def get_current_enrollment(self, obj):
        enrollment = obj.enrollments.filter(is_current=True).first()
        if enrollment:
            return StudentLevelSerializer(enrollment).data
        return None
