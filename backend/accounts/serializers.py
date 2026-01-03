from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.db import transaction
from django.conf import settings

from accounts.models import User
from organizations.models import Organization, Domain
from roles.models import Role, UserRole


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "is_active")


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(email=email, password=password)

        if not user:
            raise AuthenticationFailed("Invalid credentials")

        if not user.is_active:
            raise AuthenticationFailed("User account is disabled")

        attrs["user"] = user
        return attrs


class OrganizationRegisterSerializer(serializers.Serializer):
    organization_name = serializers.CharField(max_length=255)
    subdomain = serializers.SlugField(max_length=50)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)

    def validate_subdomain(self, value):
        if Organization.objects.filter(schema_name=value).exists():
            raise serializers.ValidationError("This subdomain is already taken.")
        return value

    def validate_email(self, value):
        # We allow existing users to register new organizations
        return value

    def create(self, validated_data):
        org_name = validated_data["organization_name"]
        subdomain = validated_data["subdomain"]
        email = validated_data["email"]
        password = validated_data["password"]
        phone = validated_data.get("phone", "")

        base_domain = "localhost"
        full_domain_name = f"{subdomain}.{base_domain}"

        # We remove transaction.atomic() because tenant creation (DDL)
        # and subsequent data insertion (DML) can conflict in transactions
        # with django-tenants.

        # 1. Create Organization
        organization = Organization.objects.create(
            name=org_name,
            schema_name=subdomain,
        )

        # 2. Create Domain
        domain = Domain.objects.create(
            domain=full_domain_name, tenant=organization, is_primary=True
        )

        # 3. Handle User (Shared in Public Schema)
        user = User.objects.filter(email=email).first()
        if user:
            # Security: Verify password if user exists
            if not user.check_password(password):
                raise serializers.ValidationError(
                    {
                        "password": "Password does not match existing account for this email."
                    }
                )
        else:
            user = User.objects.create_user(email=email, password=password)

        # 4. Create "Owner" Role if not exists (Public Schema)
        owner_role, _ = Role.objects.get_or_create(
            slug="owner", defaults={"name": "Owner", "is_system_role": True}
        )

        # 5. Link User to Org with Role (Public Schema)
        # This triggers profiles/signals.py to auto-create Identity Profile, StaffProfile and InstitutionProfile
        UserRole.objects.create(user=user, organization=organization, role=owner_role)

        # 6. Update the auto-created personal profile with the user's phone
        from profiles.models import Profile
        from django_tenants.utils import tenant_context

        with tenant_context(organization):
            Profile.objects.filter(user_id=user.id).update(phone=phone)

        return {
            "organization": organization,
            "domain": domain,
            "user": user,
            "domain_url": f"http://{full_domain_name}:3555/login",
        }
