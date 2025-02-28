from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.cache import cache

from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from rest_framework.generics import RetrieveAPIView
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
    StatisticReadSerializer,
    StatisticWriteSerializer
)


class CurrentUserView(RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    

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

    @method_decorator(cache_page(60 * 15, key_prefix='tournament_list'))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

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
        tournament = self.get_object()
        
        if tournament.is_over:
            raise PermissionDenied("This tournament is already finished.")
            
        if tournament.organizer != self.request.user:
            raise PermissionDenied("Only the tournament organizer can finish tournament.")
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

    def list(self, request, *args, **kwargs):
        user_id = self.request.user.id
        cache_key = f'user_teams_list_{user_id}'

        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response(cached_data)

        response = super().list(request, *args, **kwargs)
        cache.set(cache_key, response.data, 60 * 15)

        return response



class Schedule(generics.ListCreateAPIView):
    permission_classes = [AllowAny]

    def get_queryset(self):
        tournament_id = self.request.query_params.get("tournament")
        if tournament_id:
            return Match.objects.filter(tournament__id=tournament_id)
        return Match.objects.none()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return MatchWriteSerializer
        return MatchReadSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def perform_create(self, serializer):
        tournament = serializer.validated_data.get("tournament")
        if tournament.organizer != self.request.user:
            raise PermissionDenied("Only the tournament organizer can add matches.")
        serializer.save()


class StatisticView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return StatisticWriteSerializer
        return StatisticReadSerializer

    def get_queryset(self):
        match_id = self.request.query_params.get("match")
        player_ids = self.request.query_params.get("player")

        if match_id and player_ids:
            player_ids = player_ids.split(',')
            return Statistic.objects.filter(match__id=match_id, player__id__in=player_ids)
        return Statistic.objects.none()


class StatisticUpdateView(generics.UpdateAPIView):
    queryset = Statistic.objects.all()
    serializer_class = StatisticWriteSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"


    def perform_update(self, serializer):
        serializer.save()