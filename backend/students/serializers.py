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
    username = serializers.CharField(max_length=150, required=False, allow_blank=True)
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

        # 1. Create Identity Profile (No login credentials yet)
        profile = Profile.objects.create(
            user_id=None,  # No global user at admission time
            local_username=None,  # Will be set during portal activation
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


class BulkAccountCreationSerializer(serializers.Serializer):
    student_id = serializers.UUIDField()
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128)
    email = serializers.EmailField(required=False, allow_null=True)

    def validate_student_id(self, value):
        if not Student.objects.filter(id=value).exists():
            raise serializers.ValidationError("Student not found")
        return value

    def validate_username(self, value):
        # We don't validate against global User table anymore
        # Instead, we'll check local_username uniqueness within the tenant
        return value

    def _generate_unique_local_username(self, base_username):
        """
        Generate a unique local_username within the current tenant.
        Appends numbers if duplicates exist (e.g., johnprasaddoe, johnprasaddoe2, johnprasaddoe3)
        """
        local_username = base_username
        counter = 2

        # Check if this local_username already exists in this school
        while Profile.objects.filter(local_username=local_username).exists():
            local_username = f"{base_username}{counter}"
            counter += 1

        return local_username

    def _generate_global_username(self, local_username):
        """
        Generate a globally unique username for the User table.
        Format: local_username + random suffix
        """
        while True:
            random_suffix = uuid.uuid4().hex[:6]
            global_username = f"{local_username}_{random_suffix}"

            if not User.objects.filter(username=global_username).exists():
                return global_username

    @transaction.atomic
    def save(self, **kwargs):
        student_id = self.validated_data["student_id"]
        provided_username = self.validated_data[
            "username"
        ]  # From frontend (e.g., "johnprasaddoe")
        password = self.validated_data["password"]
        email = self.validated_data.get("email")

        student = Student.objects.select_related("profile").get(id=student_id)
        profile = student.profile

        if profile.user_id:
            raise serializers.ValidationError(
                "This student already has a user account."
            )

        # Step 1: Generate unique local_username (school-specific)
        # This is what the user will see and use to login
        local_username = self._generate_unique_local_username(provided_username)

        # Step 2: Generate globally unique username for User table
        # This is for Django's authentication system
        global_username = self._generate_global_username(local_username)

        # Step 3: Create global user with the unique global username
        user = User.objects.create_user(
            username=global_username,  # Globally unique
            email=email or None,
            password=password,
            needs_password_change=True,
            initial_password_display=password,
        )

        # Step 4: Assign Student Role
        from django.db import connection
        from roles.models import Role, UserRole

        try:
            student_role = Role.objects.get(slug="student")
            UserRole.objects.get_or_create(
                user=user,
                role=student_role,
                organization=connection.tenant,
                defaults={"is_active": True},
            )
        except Role.DoesNotExist:
            print("Warning: 'student' role not found. Ensure roles are seeded.")

        # Step 5: Update profile with both usernames
        profile.user_id = user.id
        profile.local_username = local_username  # School-specific (e.g., "johnprasaddoe" or "johnprasaddoe2")
        profile.save()

        return user
