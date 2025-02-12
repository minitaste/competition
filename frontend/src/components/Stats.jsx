import React, { useEffect, useState } from "react";
import api from "../api";
import Loading from "./Loading";
import EditStats from "./EditStats";

const Stats = ({ matchId, team1PlayerIds, team2PlayerIds }) => {
  const [team1Stats, setTeam1Stats] = useState([]);
  const [team2Stats, setTeam2Stats] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStats = async (playerIds = []) => {
    try {
      console.log(playerIds);
      const playerQuery = playerIds.join(",");
      const response = await api.get(
        `/api/tournaments/participate/statistic/?match=${matchId}&player=${playerQuery}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error with fetching stats...", error);
      return [];
    }
  };

  const handleCheckStats = async () => {
    setLoading(true);
    const stats1 = await getStats(team1PlayerIds);
    setTeam1Stats(stats1);

    const stats2 = await getStats(team2PlayerIds);
    setTeam2Stats(stats2);

    setLoading(false);
  };

  return (
    <div className="p-2">
      <EditStats
        handleCheckStats={handleCheckStats}
        team1Stats={team1Stats}
        team2Stats={team2Stats}
      />

      <button
        onClick={handleCheckStats}
        className="flex p-2 rounded-2xl text-xl cursor-pointer items-center bg-indigo-800 hover:bg-indigo-900 text-stone-100"
      >
        Check stats
        <img src="/stats.svg" className="ml-1" />
      </button>
      {loading && <Loading />}
      {team1Stats.length ? (
        <div className="pt-2">
          <div className="flex justify-between">
            <h2>Team 1 stats:</h2>
          </div>
          <div className="flex flex-col space-y-4">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-800 text-white">
                  <th className="text-left p-2 w-34 border">Player</th>
                  <th className="p-2 border">PTS</th>
                  <th className="p-2 border">AST</th>
                  <th className="p-2 border">REB</th>
                  <th className="p-2 border">STL</th>
                  <th className="p-2 border">BLK</th>
                </tr>
              </thead>
              <tbody>
                {team1Stats.map((player) => (
                  <tr key={player.id} className="bg-zinc-900 text-white">
                    <td className="pl-2 border">{player.player.username}</td>
                    <td className="text-center border">{player.points}</td>
                    <td className="text-center border ">{player.assists}</td>
                    <td className="text-center border ">{player.rebounds}</td>
                    <td className="text-center border ">{player.steals}</td>
                    <td className="text-center border ">{player.blocks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Team 2 stats:</h2>
            <div className="flex flex-col space-y-4">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-800 text-white">
                    <th className="text-left p-2 w-34 border">Player</th>
                    <th className="p-2 border">PTS</th>
                    <th className="p-2 border">AST</th>
                    <th className="p-2 border">REB</th>
                    <th className="p-2 border">STL</th>
                    <th className="p-2 border">BLK</th>
                  </tr>
                </thead>
                <tbody>
                  {team2Stats.map((player) => (
                    <tr key={player.id} className="bg-zinc-900 text-white">
                      <td className="pl-2 border">{player.player.username}</td>
                      <td className="text-center border">{player.points}</td>
                      <td className="text-center border ">{player.assists}</td>
                      <td className="text-center border ">{player.rebounds}</td>
                      <td className="text-center border ">{player.steals}</td>
                      <td className="text-center border ">{player.blocks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button className="mt-2 flex px-4 p-2 rounded-2xl text-xl cursor-pointer items-center bg-indigo-800 hover:bg-indigo-900 text-stone-100">
            Edit stats <img src="/edit.svg" className="ml-1 size-8" />
          </button>
        </div>
      ) : (
        <p>Press the button to update stats</p>
      )}
    </div>
  );
};

export default Stats;
