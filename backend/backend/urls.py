from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import CreateUserView

urlpatterns = [
    path('admin/', admin.site.urls),

    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("api/user/register/", CreateUserView.as_view(), name="create_user"),

    path("api/", include("api.urls")),
    path("api-auth/", include("rest_framework.urls")),
]
