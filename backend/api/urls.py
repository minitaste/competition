from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [    
    path("tournaments/", views.Tournaments.as_view(), name="tournaments")
    
]
