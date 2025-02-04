from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics, status
from rest_framework.response import Response 


from .models import User, Tournament, Team
from .serializers import UserSerializer, TournamentSerializer, TeamSerializer


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class Tournaments(generics.ListCreateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [AllowAny]

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


# переписати це
class Participate(generics.UpdateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [IsAuthenticated]

    def update(self, *args, **kwargs):
        tournament = self.get_object()
        team_name = self.request.data.get("team_name")

        if not team_name:
            return Response({"error": "No team with this name."})

        try:
            team = Team.objects.get(name=team_name)
        except Team.DoesNotExist:
            return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)


        if tournament.teams.filter(id=team.id).exists():
            return Response({"error": "Team is already in the tournament"}, status=status.HTTP_400_BAD_REQUEST)

        tournament.teams.add(team)
        tournament.save()

        return Response({"success": "Team added successfully."}, status=status.HTTP_200_OK)