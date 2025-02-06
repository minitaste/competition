import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import CreateTeam from "./CreateTeam";
import EditTeam from "./EditTeam";

const Participate = () => {
  const { tournamentId } = useParams();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeamForEdit, setSelectedTeamForEdit] = useState(null);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/teams-by-tournament/?tournament=${tournamentId}`
      );
      setTeams(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [tournamentId]);

  return (
    <div className="py-1 px-4">
      <button
        className="ml-auto px-4 pr-3 py-2 mt-4 rounded-2xl flex justify-end text-xl cursor-pointer items-center bg-indigo-800 hover:bg-indigo-900 text-stone-100"
        onClick={() => setIsModalOpen(true)}
      >
        Create Team
        <img src="/plus.svg" className="size-7 ml-1" alt="Plus icon" />
      </button>

      {isModalOpen && (
        <CreateTeam
          fetchTeams={fetchTeams}
          tournamentId={tournamentId}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <div className="text-white">
        <h2 className="text-center text-3xl">Teams in Tournament</h2>
        {loading ? (
          <Loading />
        ) : (
          <ul className="space-y-4 p-2">
            {teams.map((team) => (
              <li
                key={team.id}
                className="flex flex-col p-2 w-full border border-gray-700 bg-zinc-900/70"
              >
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
                  className="mt-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                >
                  Edit team
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedTeamForEdit && (
        <EditTeam
          team={selectedTeamForEdit}
          fetchTeams={fetchTeams}
          onClose={() => setSelectedTeamForEdit(null)}
        />
      )}
    </div>
  );
};

export default Participate;
