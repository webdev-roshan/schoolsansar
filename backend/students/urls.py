from django.urls import path
from .views import (
    StudentEnrollmentView,
    StudentListView,
    PortalActivationView,
    CredentialDistributionView,
)

urlpatterns = [
    path("enroll/", StudentEnrollmentView.as_view(), name="student-enroll"),
    path(
        "portal-activation/",
        PortalActivationView.as_view(),
        name="student-portal-activation",
    ),
    path("list/", StudentListView.as_view(), name="student-list"),
    path(
        "credentials/", CredentialDistributionView.as_view(), name="student-credentials"
    ),
]
