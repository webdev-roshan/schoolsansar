from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, AcademicHistoryViewSet, StudentLevelViewSet

router = DefaultRouter()
router.register(r"records", StudentViewSet)
router.register(r"history", AcademicHistoryViewSet)
router.register(r"levels", StudentLevelViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
