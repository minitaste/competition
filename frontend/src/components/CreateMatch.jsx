import React, { useState, useEffect } from "react";
import api from "../api";

const CreateMatch = ({ tournamentId, onClose }) => {
  const [teams, setTeams] = useState([]);

  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");

  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);

  const [team1Score, setTeam1Score] = useState(null);
  const [team2Score, setTeam2Score] = useState(null);

  const [error, setError] = useState("");
  
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.get(
        `/api/teams-by-tournament/?tournament=${tournamentId}`
      );
      setTeams(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const addMatch = (e) => {
    e.preventDefault();

    if (!team1 || !team2) {
      console.error("Both teams must be selected.");
    }
    if (team1.tournament != team2.tournament) {
      console.error("Teams must relate to one tournament.");
    }
    const payload = {
      tournament: tournamentId,
      team_1: team1.id,
      team_2: team2.id,
      team_1_score: team1Score,
      team_2_score: team2Score,
    };
    api
      .post(`/api/tournaments/participate/schedule/`, payload)
      .then((response) => {
        console.log("Match added successfuly", response.data);
        setTeam1(null);
        setTeam2(null);
        setTeam1Score("");
        setTeam2Score("");
        onClose();
      })
      .catch((error) => {
        setError(
          error.response.data.detail ||
            error.response.data.non_field_errors ||
            "Something went wrong"
        );

        console.error(
          "Error adding Match:",
          error.response ? error.response.data : error.message
        )
      }
      );
  };

  const filteredTeam1 = teams.filter((team) =>
    team.name.toLowerCase().includes(search1.toLowerCase())
  );
  const filteredTeam2 = teams.filter((team) =>
    team.name.toLowerCase().includes(search2.toLowerCase())
  );

  const handleSelectTeam1 = (team) => {
      setTeam1(team);
      setSearch1("")
  };

  const handleSelectTeam2 = (team) => {
      setTeam2(team);
      setSearch2("");
      
  };

  const handleRemoveTeam = (team) => {
    setSelectedTeams(selectedTeams.filter((t) => t.id !== team.id));
  };

  return (
    <>
      <div className="backdrop" onClick={onClose}></div>
      <div className="modal">
        <form onSubmit={addMatch} className="space-y-2 text-white">
          <label>Team 1:</label>
          <input
            className="mt-2 block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            type="search"
            value={search1}
            onChange={(e) => setSearch1(e.target.value)}
            placeholder="Team name..."
          />
          {search1.trim().length > 0 && (
            <ul>
              {filteredTeam1.map((team) => (
                <li
                  key={team.id}
                  onClick={() => handleSelectTeam1(team)}
                  className="cursor-pointer hover:bg-zinc-700 p-2"
                >
                  {team.name}
                </li>
              ))}
            </ul>
          )}
          {team1 && (
            <p>
              Selected Team 1: <strong>{team1.name}</strong>
            </p>
          )}
          <label>Team 1 points:</label>
          <input
            className="mt-2 block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            type="number"
            value={team1Score}
            onChange={(e) => setTeam1Score(e.target.value)}
            placeholder="PTS team scored.."
          />
          <label>Team 2:</label>
          <input
            className="block w-full rounded-md px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            type="search"
            value={search2}
            onChange={(e) => setSearch2(e.target.value)}
            placeholder="Team name..."
          />
          {search2.trim().length > 0 && (
            <ul>
              {filteredTeam2.map((team) => (
                <li
                  key={team.id}
                  onClick={() => handleSelectTeam2(team)}
                  className="cursor-pointer hover:bg-zinc-700 p-2"
                >
                  {team.name}
                </li>
              ))}
            </ul>
          )}
          {team2 && (
            <p>
              Selected Team 2: <strong>{team2.name}</strong>
            </p>
          )}
          <label>Team 2 points:</label>
          <input
            className="block w-full rounded-md px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            type="number"
            value={team2Score}
            onChange={(e) => setTeam2Score(e.target.value)}
            placeholder="PTS team scored.."
          />

          <p className="text-red-500 text-center mb-2">{error}</p>

          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
};

export default CreateMatch;
