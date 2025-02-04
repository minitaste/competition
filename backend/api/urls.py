from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [    
    path("teams/", views.Teams.as_view(), name="teams"),
    path("tournaments/", views.Tournaments.as_view(), name="tournaments"),
    path("tournaments/<int:pk>/participate/", views.Participate.as_view()),
]
