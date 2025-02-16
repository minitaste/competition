from rest_framework.permissions import AllowAny
from rest_framework import generics

from .models import News
from .serializers import NewsSerializer

class NewsView(generics.ListAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]
