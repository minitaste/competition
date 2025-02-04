from django import forms
from django.core.exceptions import ValidationError
from .models import Team

class TeamForm(forms.ModelForm):  
    class Meta:
        model = Team
        fields = '__all__'

    def clean_players(self):  
        players = self.cleaned_data.get('players')
        if players and players.count() < 3:
            raise ValidationError("Can't have less than 3 players in a team.")
        return players
