from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Tournament, Team, Match
from datetime import datetime, timedelta

User = get_user_model()


class BaseTestCase(TestCase):
    """Base test case with common setup"""

    def setUp(self):
        """Create authenticated client and user"""
        self.client = APIClient()
        self.user = User.objects.create_user(username="username", password="password")
        self.client.force_authenticate(user=self.user)

        self.valid_future_date = (datetime.now() + timedelta(days=2)).strftime(
            "%Y-%m-%d"
        )


class TournamentTest(BaseTestCase):
    """Test cases for Tournament endpoint"""

    def setUp(self):
        super().setUp()
        self.valid_tournament_data = {
            "name": "Lviv Cup",
            "start": "2025-02-22",
            "teams_limit": 10,
            "location": "Lviv",
        }

    def test_get_tournaments_list(self):
        """Should return list of tournaments"""
        Tournament.objects.create(**self.valid_tournament_data, organizer=self.user)
        Tournament.objects.create(
            name="Second Tournament",
            start=self.valid_future_date,
            teams_limit=8,
            location="Another Location",
            organizer=self.user,
        )

        response = self.client.get("/api/tournaments/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertIn("name", response.data[0])
        self.assertIn("organizer", response.data[0])

    def test_create_tournament_success(self):
        """Should create tournament with valid data"""
        response = self.client.post("/api/tournaments/", self.valid_tournament_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tournament.objects.count(), 1)
        tournament = Tournament.objects.first()
        self.assertEqual(tournament.name, self.valid_tournament_data["name"])
        self.assertEqual(tournament.organizer, self.user)

    def test_create_tournament_unauthorized(self):
        """Should reject tournament creation for unauthorized user"""
        self.client.force_authenticate(user=None)
        response = self.client.post("/api/tournaments/", self.valid_tournament_data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Tournament.objects.count(), 0)

    def test_create_tournament_invalid_teams_limit(self):
        """Should reject tournament creation with invalid teams limit"""
        invalid_data = self.valid_tournament_data.copy()
        invalid_data["teams_limit"] = 33

        response = self.client.post("/api/tournaments/", invalid_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("teams_limit", response.data)

    def test_create_tournament_past_date(self):
        """Should reject tournament creation with past date"""
        invalid_data = self.valid_tournament_data.copy()
        invalid_data["start"] = "2020-01-01"

        response = self.client.post("/api/tournaments/", invalid_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("start", response.data)


class TeamTest(BaseTestCase):
    """Test cases for Team endpoints"""

    def setUp(self):
        """Setup test data"""
        super().setUp()
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            start=self.valid_future_date,
            teams_limit=16,
            location="Test Location",
            organizer=self.user,
        )
        self.valid_team_data = {
            "name": "Test Team",
            "tournament": self.tournament.id,
            "players": self.user.id,
        }

    def test_create_team_success(self):
        """Should create team with valid data"""
        response = self.client.post("/api/teams/", self.valid_team_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 1)
        team = Team.objects.first()
        self.assertEqual(team.name, self.valid_team_data["name"])
        self.assertEqual(team.tournament, self.tournament)
        self.assertIn(self.user, team.players.all())

    def test_create_team_tournament_full(self):
        """Should reject team creation when tournament is full"""
        # Create maximum allowed teams
        for i in range(self.tournament.teams_limit):
            Team.objects.create(name=f"Team {i}", tournament=self.tournament)

        response = self.client.post("/api/teams/", self.valid_team_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("tournament", response.data)

    # def test_patch_teams(self):
    #     response = self.client.patch(
    #         f"/api/teams/{self.team.id}/", {"name": "Not test team"}
    #     )
    #     self.assertEqual(response.status_code, 200)


class MatchTest(BaseTestCase):
    """Test cases for Match endpoints"""

    def setUp(self):
        """Setup test data"""
        super().setUp()
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            start=self.valid_future_date,
            teams_limit=16,
            location="Test Location",
            organizer=self.user,
        )
        self.team1 = Team.objects.create(name="Team 1", tournament=self.tournament)
        self.team2 = Team.objects.create(name="Team 2", tournament=self.tournament)
        self.valid_match_data = {
            "tournament": self.tournament.id,
            "team_1": self.team1.id,
            "team_1_score": 2,
            "team_2": self.team2.id,
            "team_2_score": 1,
        }

    def test_create_match_success(self):
        """Should create match with valid data"""
        response = self.client.post(
            "/api/tournaments/participate/schedule/", self.valid_match_data
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Match.objects.count(), 1)
        match = Match.objects.first()
        self.assertEqual(match.team_1_score, self.valid_match_data["team_1_score"])
        self.assertEqual(match.team_2_score, self.valid_match_data["team_2_score"])

    def test_create_match_same_team(self):
        """Should reject match creation with same team"""
        invalid_data = self.valid_match_data.copy()
        invalid_data["team_2"] = self.team1.id

        response = self.client.post(
            "/api/tournaments/participate/schedule/", invalid_data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)

    def test_create_match_different_tournaments(self):
        """Should reject match between teams from different tournaments"""
        other_tournament = Tournament.objects.create(
            name="Other Tournament",
            start=self.valid_future_date,
            teams_limit=16,
            location="Other Location",
            organizer=self.user,
        )
        other_team = Team.objects.create(name="Other Team", tournament=other_tournament)

        invalid_data = self.valid_match_data.copy()
        invalid_data["team_2"] = other_team.id

        response = self.client.post(
            "/api/tournaments/participate/schedule/", invalid_data
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class StatisticTest(BaseTestCase):
    """Test cases for player statistics endpoints"""

    def setUp(self):
        """Setup test data"""
        super().setUp()
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            start=self.valid_future_date,
            teams_limit=16,
            location="Test Location",
            organizer=self.user
        )
        
        self.other_user = User.objects.create_user(
            username="other_user",
            password="testpass123",
            email="other@example.com"
        )
        
        self.team1 = Team.objects.create(name="Team 1", tournament=self.tournament)
        self.team1.players.add(self.user)
        
        self.team2 = Team.objects.create(name="Team 2", tournament=self.tournament)
        self.team2.players.add(self.other_user)
        
        self.match = Match.objects.create(
            tournament=self.tournament,
            team_1=self.team1,
            team_1_score=2,
            team_2=self.team2,
            team_2_score=1
        )
        
        self.valid_statistic_data = {
            "player": self.user.id,
            "match": self.match.id,
            "points": 11,
            "assists": 2,
            "rebounds": 3,
            "steals": 2,
            "blocks": 1
        }

    def test_create_statistic_success(self):
        """Should successfully create statistics for a player"""
        response = self.client.post(
            "/api/tournaments/participate/statistic/",
            self.valid_statistic_data
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["points"], self.valid_statistic_data["points"])
        self.assertEqual(response.data["player"], self.valid_statistic_data["player"])
        
    def test_update_statistics(self):        
        """Should update existing statistics"""
        # Create initial statistics
        response = self.client.post(
            "/api/tournaments/participate/statistic/",
            self.valid_statistic_data
        )
        statistic_id = response.data["id"]
        
        # Update statistics
        update_data = {"points": 15}
        response = self.client.patch(
            f"/api/tournaments/participate/statistic/{statistic_id}/",
            update_data
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["points"], 15)
