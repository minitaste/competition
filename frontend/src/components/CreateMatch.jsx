import React, {useState, useEffect} from "react";
import api from "../api";


const CreateMatch = ({ tournamentId, onClose }) => {
  const [teams, setTeams] = useState([]);
  const [teamsScore, setTeamsScore] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);

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

  const addMatch = () => {
    const payload = {
      tournament: tournamentId,
      team_1: selectedTeams.at(0),
      team_2: selectedTeams.at(1),
      team_1_score: teamsScore.at(0),
      team_2_score: teamsScore.at(1),
    };
    api
      .post(`/api/tournaments/participate/schedule/`, payload)
      .then((response) => {
        console.log("Match added successfuly", response.data);
        setSelectedTeams([]);
          setTeamsScore([]);
        onClose();
          
      })
      .catch((error) =>
        console.error(
          "Error adding Match:",
          error.response ? error.response.data : error.message
        )
      );
  };

    const handleSelectTeam = (team) => {
      if (!selectedTeams.includes(team) && (selectedTeams.lenght < 2))  {
        setSelectedTeams([...selectedTeams, team]);
      }
    };

    
    return (
      <>
        <div className="backdrop" onClick={onClose}></div>
        <div className="modal">
          <form onSubmit={addMatch} className="space-y-2 text-white">
            <label>Team 1:</label>
            <input />
            <label>Team 1 points:</label>
            <input />
            <label>Team 2:</label>
            <input />
            <label>Team 2 points:</label>
            <input />

            <input type="submit" value="Submit" />
          </form>
        </div>
      </>
    );
};

export default CreateMatch;
