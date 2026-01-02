from rest_framework import serializers
from .models import Profile, InstitutionProfile
from django.db import connection


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = (
            "id",
            "user_id",
            "email",
            "first_name",
            "middle_name",
            "last_name",
            "gender",
            "date_of_birth",
            "blood_group",
            "phone",
            "alt_phone",
            "address",
            "profile_image",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "user_id", "email")


class InstitutionProfileSerializer(serializers.ModelSerializer):
    # These fields come from the Organization model in the public schema
    name = serializers.CharField(required=False)
    phone = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)

    class Meta:
        model = InstitutionProfile
        fields = (
            "id",
            "name",
            "phone",
            "email",
            "logo",
            "banner",
            "tagline",
            "mission",
            "vision",
            "about",
            "established_date",
            "website",
            "facebook_url",
            "instagram_url",
            "twitter_url",
            "linkedin_url",
        )
        read_only_fields = ("id",)

    def to_representation(self, instance):
        """Add organization data to the output."""
        data = super().to_representation(instance)
        tenant = getattr(connection, "tenant", None)
        if tenant:
            data["name"] = tenant.name
            data["phone"] = getattr(tenant, "phone", "")
            data["email"] = getattr(tenant, "email", "")
        return data

    def update(self, instance, validated_data):
        # Extract organization-related fields
        tenant = validated_data.pop("organization", getattr(connection, "tenant", None))

        org_fields = ["name", "phone", "email"]
        updated_org = False

        for field in org_fields:
            if field in validated_data:
                val = validated_data.pop(field)
                if tenant:
                    setattr(tenant, field, val)
                    updated_org = True

        if updated_org and tenant:
            tenant.save()

        return super().update(instance, validated_data)
