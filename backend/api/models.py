from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator
from django.contrib.auth.models import User


class Tournament(models.Model):
    name = models.CharField(max_length=255)
    organizer = models.ForeignKey(User, on_delete=models.CASCADE)
    is_over = models.BooleanField(default=False)
    start = models.DateField()
    teams = models.ManyToManyField('Team', blank=True, related_name='tournaments')
    teams_limit = models.PositiveIntegerField(validators=[MaxValueValidator(32)])
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}"

    def validate_teams_limit(self):
        if self.teams_limit > 32:
            raise ValidationError("Can`t be more then 32 teams.")

    def clean(self):
        self.validate_teams_limit()
        super().clean()

        
    class Meta:
        ordering = ['start']


class Team(models.Model):
    name = models.CharField(max_length=100)
    captain = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    players = models.ManyToManyField(User, related_name='teams', blank=True)  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}"
    
    def validate_teams_players(self):
        if self.players < 3:
            raise ValidationError("Can`t be less then 3 players.")
    def clean(self):
        super().clean()
        
        if self.pk:
            if self.players.count() < 3:
                raise ValidationError("Can`t be less than 3 players.")


class Match(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)  
    team_1 = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team1_matches')  
    team_1_score = models.PositiveIntegerField(default=0)
    team_2 = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team2_matches')  
    team_2_score = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.team_1} vs {self.team_2} - {self.tournament.name}"


class Statistic(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE)  
    match = models.ForeignKey(Match, on_delete=models.CASCADE)  
    points = models.PositiveIntegerField(default=0)
    assists = models.PositiveIntegerField(default=0)
    rebounds = models.PositiveIntegerField(default=0)
    steals = models.PositiveIntegerField(default=0)
    blocks = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.player.username} stats"
