from . models import User, Tournament, Team

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
    players = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=True
    )
    captain = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Team
        fields = "__all__"

        
class TeamReadSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)
    captain = PlayerSerializer(read_only=True)

    class Meta:
        model = Team
        fields = "__all__"


class TournamentSerializer(serializers.ModelSerializer):
    teams = TeamReadSerializer(many=True, read_only=True)
    
    class Meta:
        model = Tournament
        fields = "__all__"
        read_only_fields = ['organizer', 'created_at',]
              
    def validate_start(self, value):
        if value < date.today():
            raise serializers.ValidationError("End can`t be before start.")
        return value