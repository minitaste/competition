from .models import User, Tournament, Team, Match, Statistic

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from datetime import date


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "username": {"validators": [UniqueValidator(queryset=User.objects.all(), message="Username already taken.")]},
        }

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

    def validate_tournament(self, value):
        if value.teams.count() > value.teams_limit:
            raise serializers.ValidationError("Max team limit is full.")
        return value

    def validate_players(self, value):
        if len(value) > 4:
            raise serializers.ValidationError("Can`t be more than 4 players.")
        return value


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
        team_1_score = data.get("team_1_score")
        team_2_score = data.get("team_2_score")
        tournament = data.get("tournament")
        if team_1 == team_2:
            raise serializers.ValidationError("A team cannot play against itself.")
        if team_1.tournament != tournament or team_2.tournament != tournament:
            raise serializers.ValidationError(
                "Both teams must belong to the same tournament as the match."
            )
        if team_1_score > 22 or team_2_score > 22:
            raise serializers.ValidationError("Enter correct score.")
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


class StatisticReadSerializer(serializers.ModelSerializer):
    player = serializers.StringRelatedField()

    class Meta:
        model = Statistic
        fields = "__all__"


class StatisticWriteSerializer(serializers.ModelSerializer):
    player = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Statistic
        fields = "__all__"

    def validate(self, data):
        instance = getattr(self, "instance", None)
        player = data.get("player", instance.player if instance else None)
        match = data.get("match", instance.match if instance else None)

        if not instance and (not player or not match):
            raise serializers.ValidationError("Both player and match are required")

        if instance and not (player and match):
            return data

        is_team_player = (
            match.team_1.players.filter(id=player.id).exists()
            or match.team_2.players.filter(id=player.id).exists()
        )

        if not is_team_player:
            raise serializers.ValidationError(
                "Player must belong to one of the teams in the match"
            )

        existing_stat = Statistic.objects.filter(player=player, match=match)
        if instance:
            existing_stat = existing_stat.exclude(id=instance.id)

        if existing_stat.exists():
            raise serializers.ValidationError(
                "Statistics for this player in this match already exists"
            )

        return data
