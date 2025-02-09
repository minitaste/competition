from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q

from .models import User, Tournament, Team, Match, Statistic
from .serializers import UserSerializer, TournamentSerializer, TeamCreateSerializer, TeamReadSerializer, MatchReadSerializer, MatchWriteSerializer


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
    permission_classes = [AllowAny]
    queryset = Team.objects.all()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return TeamCreateSerializer
        return TeamReadSerializer

    def get_permissions(self):
        if self.request.method == "POST": 
            return [IsAuthenticated()]
        return [AllowAny()]


class TeamsByTournamentList(generics.ListAPIView):
    serializer_class = TeamReadSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        tournament_id = self.request.query_params.get('tournament')
        if tournament_id:
            return Team.objects.filter(tournament__id=tournament_id)
        return Team.objects.none()


class EditTeam(generics.UpdateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamCreateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def perform_update(self, serializer):
        instance = self.get_object()
        if self.request.user not in instance.players.all():
            raise PermissionDenied("Only team players can edit the team.")
        serializer.save()


class UserTeams(generics.ListAPIView):
    serializer_class = TeamReadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Team.objects.filter(players=user).distinct()



class Schedule(generics.ListCreateAPIView):
    permission_classes = [AllowAny]

    def get_queryset(self):
        tournament_id = self.request.query_params.get('tournament')
        if tournament_id:
            return Match.objects.filter(tournament__id=tournament_id)
        return Match.objects.all()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return MatchWriteSerializer
        return MatchReadSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]


