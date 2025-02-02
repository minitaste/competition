from . models import User, Tournament

from rest_framework import serializers
from datetime import date

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
         


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = "__all__"
              
    def validate_start(self, value):
        if value < date.today():
            raise serializers.ValidationError("End can`t be before start.")
        return value