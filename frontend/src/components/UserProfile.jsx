import React, { useContext, useEffect, useState } from "react";
import api from "../api";
import EditTeam from "./EditTeam";
import { AuthContext } from "../AuthContext";

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  const [teams, setTeams] = useState([]);
  const [selectedTeamForEdit, setSelectedTeamForEdit] = useState(null);

  useEffect(() => {
    getTeams();
  }, []);

  const getTeams = async () => {
    try {
      const response = await api.get(`/api/user/profile/teams/`);
      setTeams(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error with fetching tournaments:", error);
    }
  };

  return (
    <div className="px-4 py-2">
      <p className="text-white text-right text-xl">
        Profile username: <span className="font-bold underline">{user.username}</span>
      </p>

      <h1 className="text-center text-white text-xl">Your teams:</h1>
      <div className="space-y-4 text-white">
        {teams.map((team) => (
          <div
            key={team.id}
            className="flex flex-col p-2 w-full border border-gray-700 bg-zinc-900/70"
          >
            <h2 className="text-xl mb-2 border-b ">
              Tournament name: {team.tournament}
            </h2>
            <div className="flex justify-between px-4">
              <h2 className="text-xl mb-4">Team: {team.name}</h2>
              {team?.captain?.username ? (
                <p>Team captain: {team.captain.username}</p>
              ) : (
                <p>Team don't have captain</p>
              )}
            </div>

            <div className="flex justify-around">
              {team.players.map((player) => (
                <p key={player.id} className="text-center">
                  <img
                    src="/profile-male.svg"
                    className="size-22 bg-white rounded-2xl"
                    alt="Profile icon"
                  />
                  {player.username}
                </p>
              ))}
            </div>
            <button
              onClick={() => setSelectedTeamForEdit(team)}
              className="mx-auto mt-2 px-4 py-2 bg--700 rounded bg-indigo-800 hover:bg-indigo-900"
            >
              Edit team
            </button>
          </div>
        ))}
        {selectedTeamForEdit && (
          <EditTeam
            team={selectedTeamForEdit}
            fetchTeams={getTeams}
            onClose={() => setSelectedTeamForEdit(null)}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
