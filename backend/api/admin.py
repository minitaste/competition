from django.contrib import admin
from . models import Tournament, Team
from .forms import TeamForm

# Register your models here.
admin.site.register(Tournament)


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    form = TeamForm
