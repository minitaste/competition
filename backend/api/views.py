from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics, status
from rest_framework.response import Response 


from .models import User, Tournament, Team
from .serializers import UserSerializer, TournamentSerializer, TeamSerializer


class CreateUserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class Tournaments(generics.ListCreateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    def get_permissions(self):
        if self.request.method == "POST": 
            return [IsAuthenticated()]
        return [AllowAny()]


class Teams(generics.ListCreateAPIView):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        captain_teams = Team.objects.filter(captain=self.request.user)
        player_teams = Team.objects.filter(players=self.request.user)
        
        return (captain_teams | player_teams).distinct()

    
    def perform_create(self, serializer):
        serializer.save(captain=self.request.user)


class Participate(generics.UpdateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def perform_update(self, serializer):
        instance = serializer.instance
        current_teams = list(instance.teams.all().values_list('id', flat=True))
        new_teams = self.request.data.get("teams", [])
        merged_teams = list(set(current_teams + new_teams))
        serializer.save(teams=merged_teams)