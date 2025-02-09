from django.contrib import admin
from . models import Tournament, Team, Match, Statistic
from .forms import TeamForm

# Register your models here.
admin.site.register(Tournament)
admin.site.register(Match)
admin.site.register(Statistic)

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    form = TeamForm
