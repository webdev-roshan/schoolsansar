from django.urls import path
from .views import (
    RegisterOrganizationView,
    LoginView,
    LogoutView,
    MeView,
    TokenRefreshView,
    VerifyAccountView,
    ChangePasswordView,
)

urlpatterns = [
    path(
        "register-organization/",
        RegisterOrganizationView.as_view(),
        name="register-organization",
    ),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("me/", MeView.as_view(), name="me"),
    path("verify-account/", VerifyAccountView.as_view(), name="verify-account"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]
