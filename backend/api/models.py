from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator
from django.contrib.auth.models import User


class Tournament(models.Model):
    name = models.CharField(max_length=255)
    organizer = models.ForeignKey(User, on_delete=models.CASCADE)
    is_over = models.BooleanField(default=False)
    start = models.DateField()
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
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='teams')
    captain = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    players = models.ManyToManyField(User, related_name='teams', blank=True)  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}, {self.tournament}"

    class Meta:
        ordering = ['-created_at']
                
                
class Match(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)  
    team_1 = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team1_matches')  
    team_1_score = models.PositiveIntegerField(default=0)
    team_2 = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team2_matches')  
    team_2_score = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    

    def __str__(self):
        return f" {self.tournament.name} - {self.team_1} vs {self.team_2}"

    def clean(self):
        super().clean()
        if self.team_1 == self.team_2:
            raise ValidationError("A team cannot play against itself.")

        if self.team_1_score > 22 or self.team_2_score > 22:
            raise ValidationError("Enter correct score.")

        if self.team_1.tournament != self.tournament or self.team_2.tournament != self.tournament:
            raise ValidationError("Both teams must belong to the same tournament as the match.")

    class Meta:
        unique_together = ('tournament', 'team_1', 'team_2')
        ordering = ['-created_at']


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
