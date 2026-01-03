from rest_framework import serializers
from .models import Student, AcademicHistory, StudentLevel
from profiles.models import Profile
from families.models import Parent, StudentParentRelation
from django.db import transaction
import uuid
from django.apps import apps
from django_tenants.utils import tenant_context, get_public_schema_name

User = apps.get_model("accounts", "User")


class StudentEnrollmentSerializer(serializers.Serializer):
    # Basic Info for Profile
    first_name = serializers.CharField(max_length=100)
    middle_name = serializers.CharField(
        max_length=100, required=False, allow_blank=True
    )
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField(required=False, allow_null=True)
    gender = serializers.ChoiceField(
        choices=[("male", "Male"), ("female", "Female"), ("other", "Other")]
    )
    date_of_birth = serializers.DateField()
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)

    # Academic Info
    level = serializers.CharField(max_length=50)
    section = serializers.CharField(max_length=10, required=False, allow_blank=True)
    academic_year = serializers.CharField(max_length=20)
    admission_date = serializers.DateField(required=False, allow_null=True)
    previous_school = serializers.CharField(required=False, allow_blank=True)
    last_grade_passed = serializers.CharField(required=False, allow_blank=True)

    # Parent Info (Nested)
    parents = serializers.ListField(
        child=serializers.DictField(), required=False, default=[]
    )

    def validate_email(self, value):
        if value:
            # Check if user already exists in public schema
            # We allow existing users to be enrolled in new schools
            pass
        return value

    @transaction.atomic
    def create(self, validated_data):
        parents_data = validated_data.pop("parents", [])

        # 1. Handle Global User
        email = validated_data.get("email")
        user_id = None
        if email:
            user, created = User.objects.get_or_create(
                email=email, defaults={"is_active": True}
            )
            if created:
                # Set a random password for now or handle invitation
                user.set_unusable_password()
                user.save()
            user_id = user.id

        # 2. Create Identity Profile
        profile = Profile.objects.create(
            user_id=user_id,
            first_name=validated_data["first_name"],
            middle_name=validated_data.get("middle_name", ""),
            last_name=validated_data["last_name"],
            gender=validated_data["gender"],
            date_of_birth=validated_data["date_of_birth"],
            phone=validated_data.get("phone", ""),
            address=validated_data.get("address", ""),
        )

        # 3. Create Student Record
        student = Student.objects.create(
            profile=profile,
            enrollment_id=f"STD-{uuid.uuid4().hex[:8].upper()}",
            admission_date=validated_data.get("admission_date"),
        )

        # 4. Create Academic History
        if validated_data.get("previous_school"):
            AcademicHistory.objects.create(
                student=student,
                previous_school=validated_data["previous_school"],
                last_grade_passed=validated_data.get("last_grade_passed", ""),
            )

        # 5. Create Initial Level Placement
        StudentLevel.objects.create(
            student=student,
            level=validated_data["level"],
            section=validated_data.get("section", ""),
            academic_year=validated_data["academic_year"],
            is_current=True,
        )

        # 6. Handle Parents
        for p_data in parents_data:
            # Create Parent Profile (usually no email for kids' parents initially)
            p_profile = Profile.objects.create(
                first_name=p_data.get("first_name", ""),
                middle_name=p_data.get("middle_name", ""),
                last_name=p_data.get("last_name", ""),
                phone=p_data.get("phone", ""),
                gender=p_data.get("gender", "other"),
                address=p_data.get("address", ""),
            )

            parent = Parent.objects.create(
                profile=p_profile, occupation=p_data.get("occupation", "")
            )

            StudentParentRelation.objects.create(
                student=student,
                parent=parent,
                relation_type=p_data.get("relation", "other"),
                is_primary_contact=p_data.get("is_primary", False),
            )

        return student
