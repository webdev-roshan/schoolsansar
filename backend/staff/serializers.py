from rest_framework import serializers
from .models import StaffMember, Instructor
from profiles.serializers import ProfileSerializer


class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = "__all__"


class StaffMemberSerializer(serializers.ModelSerializer):
    profile_details = ProfileSerializer(source="profile", read_only=True)
    instructor_data = InstructorSerializer(source="instructor_record", read_only=True)

    class Meta:
        model = StaffMember
        fields = (
            "id",
            "profile",
            "profile_details",
            "employee_id",
            "designation",
            "department",
            "joining_date",
            "is_active",
            "qualification",
            "experience_years",
            "instructor_data",
        )
