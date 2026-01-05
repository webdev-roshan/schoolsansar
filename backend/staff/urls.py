from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StaffMemberViewSet,
    InstructorViewSet,
    InstructorOnboardingView,
    InstructorActivationView,
    CredentialDistributionView,
)

router = DefaultRouter()
router.register(r"members", StaffMemberViewSet)
router.register(r"instructors", InstructorViewSet)

urlpatterns = [
    path(
        "onboard-instructor/",
        InstructorOnboardingView.as_view(),
        name="instructor-onboard",
    ),
    path(
        "activate-instructor/",
        InstructorActivationView.as_view(),
        name="instructor-activate",
    ),
    path(
        "credential-distribution/",
        CredentialDistributionView.as_view(),
        name="instructor-credentials",
    ),
    path("", include(router.urls)),
]
