from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Profile, InstitutionProfile
from .serializers import ProfileSerializer, InstitutionProfileSerializer
from django.db import connection


class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, user):
        tenant = getattr(connection, "tenant", None)
        if not tenant:
            return None
        return Profile.objects.filter(user_id=user.id).first()

    def get(self, request):
        tenant = getattr(connection, "tenant", None)
        if not tenant:
            return Response({"error": "No tenant context"}, status=400)

        profile, created = Profile.objects.get_or_create(
            user_id=request.user.id,
            defaults={
                "first_name": getattr(request.user, "first_name", "New"),
                "last_name": getattr(request.user, "last_name", "User"),
            },
        )

        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        tenant = getattr(connection, "tenant", None)
        if not tenant:
            return Response({"error": "No tenant context"}, status=400)

        profile, _ = Profile.objects.get_or_create(
            user_id=request.user.id, defaults={"first_name": "New", "last_name": "User"}
        )

        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InstitutionProfileView(APIView):
    def get_permissions(self):
        from roles.permissions import HasPermission

        if self.request.method == "GET":
            return [IsAuthenticated(), HasPermission("view_institution_profile")]
        elif self.request.method == "PATCH":
            return [IsAuthenticated(), HasPermission("edit_institution_profile")]
        return [IsAuthenticated()]

    def get_object(self):
        tenant = getattr(connection, "tenant", None)
        return InstitutionProfile.objects.filter(organization_id=tenant.id).first()

    def get(self, request):
        profile = self.get_object()
        if not profile:
            return Response(
                {"error": "Institution profile not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = InstitutionProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile = self.get_object()
        if not profile:
            return Response(
                {"error": "Institution profile not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = InstitutionProfileSerializer(
            profile, data=request.data, partial=True
        )
        if serializer.is_valid():
            # Soft-link update
            tenant = getattr(connection, "tenant", None)
            serializer.save(organization=tenant)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
