from django.urls import path
from .views import StudentEnrollmentView, StudentListView

urlpatterns = [
    path("enroll/", StudentEnrollmentView.as_view(), name="student-enroll"),
    path("list/", StudentListView.as_view(), name="student-list"),
]
