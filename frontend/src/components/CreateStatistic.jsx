import React, { useState } from "react";
import api from "../api";

const CreateStatistic = ({
  matchId,
  team_1_players,
  team_2_players,
  onClose,
}) => {
  const [points, setPoints] = useState(0);
  const [assists, setAssists] = useState(0);
  const [rebounds, setRebounds] = useState(0);
  const [steals, setSteals] = useState(0);
  const [blocks, setBlocks] = useState(0);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const allPlayers = [...team_1_players, ...team_2_players];

  const filteredPlayers = allPlayers.filter((player) =>
    player.username.toLowerCase().includes(search.toLowerCase())
  );

  const createStats = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedPlayer) {
      setError("Please select a player.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post(
        "/api/tournaments/participate/statistic/",
        {
          match: matchId,
          player: selectedPlayer.id,
          points: points,
          assists: assists,
          rebounds: rebounds,
          steals: steals,
          blocks: blocks,
        }
      );

      console.log(response.data);
      onClose();
    } catch (error) {
      setError(
        error?.response?.data?.non_field_errors?.[0] || "Something went wrong"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
    setSearch("");
  };

  return (
    <div>
      <div className="backdrop" onClick={onClose}></div>

      <div className="modal">
        <form
          onSubmit={createStats}
          className="space-y-2 text-white flex flex-col"
        >
          <label>Player to add stats:</label>
          <input
            className="mt-2 block w-full rounded-md px-3 py-1.5 text-base outline-1 placeholder:text-gray-400 focus:outline-indigo-600"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search players"
          />
          {search.trim().length > 0 && (
            <ul className="border-y border-gray-300 py-2">
              {filteredPlayers.map((player) => (
                <li
                  key={player.id}
                  onClick={() => handleSelectPlayer(player)}
                  className="cursor-pointer hover:bg-zinc-700 p-2"
                >
                  {player.username}
                </li>
              ))}
            </ul>
          )}
          <p>
            Selected player:{" "}
            {selectedPlayer ? selectedPlayer.username : "--------------"}
          </p>

          <div className="flex space-x-2 text-xl items-center">
            <label>Points</label>
            <input
              className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              type="number"
              placeholder="PTS"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
          </div>

          <div className="flex space-x-2 text-xl items-center">
            <label>Assists</label>
            <input
              className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              type="number"
              placeholder="AST"
              value={assists}
              onChange={(e) => setAssists(e.target.value)}
            />
          </div>

          <div className="flex space-x-2 text-xl items-center">
            <label>Rebounds</label>
            <input
              className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              type="number"
              placeholder="REB"
              value={rebounds}
              onChange={(e) => setRebounds(e.target.value)}
            />
          </div>

          <div className="flex space-x-2 text-xl items-center">
            <label>Steals</label>
            <input
              className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              type="number"
              placeholder="STL"
              value={steals}
              onChange={(e) => setSteals(e.target.value)}
            />
          </div>

          <div className="flex space-x-2 text-xl items-center">
            <label>Blocks</label>
            <input
              className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              type="number"
              placeholder="BLK"
              value={blocks}
              onChange={(e) => setBlocks(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 mt-1">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStatistic;
