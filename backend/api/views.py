from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied

from .models import User, Tournament, Team, Match
from .models import Statistic
from .serializers import (
    UserSerializer,
    TournamentSerializer,
    TeamCreateSerializer,
    TeamReadSerializer,
    MatchReadSerializer,
    MatchWriteSerializer,
    StatisticSerializer,
)


class CreateUserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class Tournaments(generics.ListCreateAPIView):
    serializer_class = TournamentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        tournament_id = self.request.query_params.get("tournament")
        if tournament_id:
            return Tournament.objects.filter(id=tournament_id)
        return Tournament.objects.all()

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]
        
        
class FinishTournament(generics.UpdateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def perform_update(self, serializer):
        serializer.save(is_over=True)


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
        tournament_id = self.request.query_params.get("tournament")
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
        tournament_id = self.request.query_params.get("tournament")
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


class StatisticView(generics.ListCreateAPIView):
    serializer_class = StatisticSerializer
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        match_id = self.request.query_params.get("match")
        player_ids = self.request.query_params.get("player")

        if match_id and player_ids:
            player_ids = player_ids.split(',')
            return Statistic.objects.filter(match__id=match_id, player__id__in=player_ids)
        return Statistic.objects.none()


class StatisticUpdateView(generics.UpdateAPIView):
    queryset = Statistic.objects.all()
    serializer_class = StatisticSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def perform_update(self, serializer):
        serializer.save()