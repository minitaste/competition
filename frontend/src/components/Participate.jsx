import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import CreateTeam from "./CreateTeam";
import Loading from "./Loading";

const Participate = () => {
  const { tournamentId } = useParams();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, [tournamentId]);

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


  return (
    <div className="py-1 px-4">
      <div className="flex justify-between">
        <Link
          to="schedule"
          className="px-4 pr-3 py-2 mt-4 rounded-2xl flex justify-end text-xl cursor-pointer items-center bg-indigo-800 hover:bg-indigo-900 text-stone-100"
        >
          Check Schedule
          <img src="/schedule.svg" className="size-6 ml-1" alt="Plus icon" />
        </Link>
        <button
          className=" px-4 pr-3 py-2 mt-4 rounded-2xl flex justify-end text-xl cursor-pointer items-center bg-indigo-800 hover:bg-indigo-900 text-stone-100"
          onClick={() => setIsModalOpen(true)}
        >
          Create Team
          <img src="/plus.svg" className="size-7 ml-1" alt="Plus icon" />
        </button>
      </div>

      {isModalOpen && (
        <CreateTeam
          fetchTeams={fetchTeams}
          tournamentId={tournamentId}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <div className="text-white">
        <div className="m-2 flex justify-center text-3xl border border-gray-700 bg-zinc-900/70">
          <button className="active:bg-zinc-600 h-18 w-34 hover:cursor-pointer  active:border border-indigo-500">Overview</button>
          <button className="active:bg-zinc-600 h-18 w-34 hover:cursor-pointer  active:border border-indigo-500">Teams</button>
          <button className="active:bg-zinc-600 h-18 w-34 hover:cursor-pointer  active:border border-indigo-500">Schedule</button>
        </div>
        <h2 className="text-center text-2xl">Teams in Tournament</h2>
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Participate;
