from .models import User, Tournament, Team, Match, Statistic

from rest_framework import serializers
from datetime import date


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class TeamCreateSerializer(serializers.ModelSerializer):
    players = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)
    captain = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = Team
        fields = ["id", "name", "players", "captain", "tournament", "created_at"]


class TeamReadSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)
    captain = PlayerSerializer(read_only=True)

    class Meta:
        model = Team
        fields = "__all__"


class TournamentSerializer(serializers.ModelSerializer):
    teams = TeamReadSerializer(many=True, read_only=True)
    organizer = serializers.StringRelatedField()

    class Meta:
        model = Tournament
        fields = "__all__"
        read_only_fields = [
            "organizer",
            "created_at",
        ]

    def validate_start(self, value):
        if value < date.today():
            raise serializers.ValidationError("End can`t be before start.")
        return value


class MatchWriteSerializer(serializers.ModelSerializer):
    tournament = serializers.PrimaryKeyRelatedField(queryset=Tournament.objects.all())
    team_1 = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all())
    team_2 = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all())

    class Meta:
        model = Match
        fields = "__all__"

    def validate(self, data):
        team_1 = data.get("team_1")
        team_2 = data.get("team_2")
        tournament = data.get("tournament")
        if team_1 == team_2:
            raise serializers.ValidationError("A team cannot play against itself.")
        if team_1.tournament != tournament or team_2.tournament != tournament:
            raise serializers.ValidationError(
                "Both teams must belong to the same tournament as the match."
            )
        return data


class MatchReadSerializer(serializers.ModelSerializer):
    tournament = serializers.StringRelatedField()
    team_1 = serializers.StringRelatedField()
    team_2 = serializers.StringRelatedField()
    team_1_players = serializers.SerializerMethodField()
    team_2_players = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = "__all__"

    def get_team_1_players(self, obj):
        players = obj.team_1.players.all()
        return PlayerSerializer(players, many=True).data

    def get_team_2_players(self, obj):
        players = obj.team_2.players.all()
        return PlayerSerializer(players, many=True).data


class StatisticSerializer(serializers.ModelSerializer):
    player = PlayerSerializer(many=False, read_only=True)

    class Meta:
        model = Statistic
        fields = "__all__"
