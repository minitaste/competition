import React, { useEffect, useState } from "react";
import api from "../api";
import Loading from "./Loading";
import EditTableRow from "./EditTableRow";

const Stats = ({ matchId, team1PlayerIds, team2PlayerIds, onSaveSuccess }) => {
  const [team1Stats, setTeam1Stats] = useState([]);
  const [team2Stats, setTeam2Stats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statsUpdate, setStatsUpdate] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (statsUpdate) {
      handleCheckStats();
      setStatsUpdate(false);
    }
  }, [statsUpdate]);

  const getStats = async (playerIds = []) => {
    try {
      const playerQuery = playerIds.join(",");
      const response = await api.get(
        `/api/tournaments/participate/statistic/?match=${matchId}&player=${playerQuery}`
      );
      console.log(response.data);
      if (response.data.length === 0) {
        setError("Stats is not updated yet.");
        console.log("No stats found");
      }

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

  const handleCancelStats = () => {
    setTeam1Stats([]);
    setTeam2Stats([]);
  };

  return (
    <div className="p-2">

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
                {team1Stats.map((stats) => (
                  <EditTableRow
                    key={stats.id}
                    stats={stats}
                    onUpdate={onSaveSuccess}
                    setStatsUpdate={setStatsUpdate}
                  />
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
                  {team2Stats.map((stats) => (
                    <EditTableRow
                      key={stats.id}
                      stats={stats}
                      onUpdate={onSaveSuccess}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button
            onClick={handleCancelStats}
            className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Close
          </button>
        </div>
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
};

export default Stats;
