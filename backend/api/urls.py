from django.urls import path
from . import views

urlpatterns = [
    path("user/me/", views.CurrentUserView.as_view(), name="user"),
    path("teams/", views.Teams.as_view(), name="teams"),
    path("teams/<int:pk>/", views.EditTeam.as_view(), name="teams"),
    path("tournaments/", views.Tournaments.as_view(), name="tournaments"),
    path("tournaments/finish/<int:pk>/", views.FinishTournament.as_view(), name="finish-tournaments"),
    path("tournaments/participate/schedule/", views.Schedule.as_view()),
    path("tournaments/participate/statistic/", views.StatisticView.as_view()),
    path("tournaments/participate/statistic/<int:pk>/", views.StatisticUpdateView.as_view()),
    path(
        "teams-by-tournament/",
        views.TeamsByTournamentList.as_view(),
        name="teams-by-tournament",
    ),
    path("user/profile/teams/", views.UserTeams.as_view()),
]
