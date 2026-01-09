from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProgramViewSet,
    AcademicLevelViewSet,
    SectionViewSet,
    SubjectViewSet,
    SubjectAssignmentViewSet,
)

router = DefaultRouter()
router.register(r"programs", ProgramViewSet)
router.register(r"levels", AcademicLevelViewSet)
router.register(r"sections", SectionViewSet)
router.register(r"subjects", SubjectViewSet)
router.register(r"assignments", SubjectAssignmentViewSet, basename="assignment")

urlpatterns = [
    path("", include(router.urls)),
]
