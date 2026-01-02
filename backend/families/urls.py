from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ParentViewSet, StudentParentRelationViewSet

router = DefaultRouter()
router.register(r"parents", ParentViewSet)
router.register(r"relations", StudentParentRelationViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
