from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics 
from .models import User
from .serializers import UserSerializer

def test(request):
    return JsonResponse({"message": "hello!"})

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
