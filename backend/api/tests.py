from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory, APIClient
from api.models import Tournament, Team

User = get_user_model()
# Create your tests here.

class TournamentsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(username="username", password="password")
        self.client.force_authenticate(user=self.user)


    def test_get_tournaments(self):
        response = self.client.get("/api/tournaments/")
        self.assertEqual(response.status_code, 200)

    def test_post_tournaments(self):
        response = self.client.post("/api/tournaments/", {"name": "Lviv Cup", "start": "2025-02-22", "teams_limit": 10, "location": "Lviv"})
        self.assertEqual(response.status_code, 201)

        # Validation for teams limit and wrong date.
        response = self.client.post("/api/tournaments/", {"name": "Lviv Cup", "start": "2025-02-22", "teams_limit": 33, "location": "Lviv"})
        self.assertEqual(response.status_code, 400)

        response = self.client.post("/api/tournaments/", {"name": "Lviv Cup", "start": "2025-02-18", "teams_limit": 32, "location": "Lviv"})
        self.assertEqual(response.status_code, 400)


class TeamsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="username", password="password")
        self.client.force_authenticate(user=self.user)
        self.tournament = Tournament.objects.create(name="Test tournament", organizer=self.user, start="2025-02-25", teams_limit=18, location="Test location")
        self.team = Team.objects.create(name="Test team", tournament=self.tournament)
        self.team.players.add(self.user)


    def test_get_teams(self):
        response = self.client.get("/api/teams/")
        self.assertEqual(response.status_code, 200)

    def test_post_teams(self):
        response = self.client.post("/api/teams/", {"name": "Bags", "tournament": self.tournament.id})
        self.assertEqual(response.status_code, 201)

    def test_patch_teams(self):
        response = self.client.patch(f"/api/teams/{self.team.id}/", {"name": "Not test team"})
        self.assertEqual(response.status_code, 200)