import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import CreateMatch from "./CreateMatch";
import Stats from "./Stats";

const ScheduleMatches = () => {
  const { tournamentId } = useParams();
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getMatches();
  }, []); //add here

  const getMatches = async () => {
    try {
      const response = await api.get(
        `/api/tournaments/participate/schedule/?tournament=${tournamentId}`
      );
      setMatches(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-1 px-4 space-y-2">
      <button
        className="px-4 pr-3 py-2 mt-2 rounded-2xl flex justify-end text-xl cursor-pointer items-center bg-indigo-800 hover:bg-indigo-900 text-stone-100"
        onClick={() => setIsModalOpen(true)}
      >
        Add Match
        <img src="/plus.svg" className="size-7 ml-1" alt="Plus icon" />
      </button>

      {isModalOpen && (
        <CreateMatch
          tournamentId={tournamentId}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <h1 className="text-center text-2xl">Matches results:</h1>
      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="p-2 pb-0 text-white border border-gray-700 bg-zinc-900/70"
          >
            <div className="flex justify-between px-2">
              <p className="">
                {match.team_1},{" "}
                <strong className="text-xl">Score: {match.team_1_score}</strong>
              </p>
            </div>
            <div className=" justify-between mt-2">
              <div className="flex justify-around space-x-4 border-y py-2">
                {match.team_1_players.map((player) => (
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
              <p className="py-2 px-2">
                {match.team_2},{" "}
                <strong className="text-xl">Score: {match.team_2_score}</strong>
              </p>
              <div className="flex justify-around space-x-4 border-y py-2">
                {match.team_2_players.map((player) => (
                  <div>
                    <p key={player.id} className="text-center">
                      <img
                        src="/profile-male.svg"
                        className="size-22 bg-white rounded-2xl"
                        alt="Profile icon"
                      />
                      {player.username}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <Stats
              matchId={match.id}
              team1PlayerIds={match.team_1_players.map((player) => player.id)}
              team2PlayerIds={match.team_2_players.map((player) => player.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleMatches;
