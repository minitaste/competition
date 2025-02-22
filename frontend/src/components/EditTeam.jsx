import React, { useEffect, useState } from "react";
import api from "../api";

const EditTeam = ({ team, fetchTeams, onClose }) => {
  const [captain, setCaptain] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    get_users();
  }, []);

  useEffect(() => {
    if (team) {
      setTeamName(team.name);
      setCaptain(team.captain);
      setSelectedPlayers(team.players);
    }
  }, [team]);

  const get_users = () => {
    api
      .get("/api/user/register/")
      .then((response) => response.data)
      .then((data) => {
        setPlayers(data);
        console.log(data);
      })
      .catch((error) => console.error(error));
  };

  const filteredPlayers = players.filter((player) =>
    player.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectPlayer = (player) => {
    if (!selectedPlayers.find((p) => p.id === player.id)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleRemovePlayer = (player) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
  };

  const editTeam = (e) => {
    e.preventDefault();
    const playersIds = selectedPlayers.map((player) => player.id);
    const payload = {
      name: teamName,
      players: playersIds,
    };

    if (captain) {
      payload.captain;
    }
    api
      .patch(`/api/teams/${team.id}/`, payload)
      .then((response) => {
        console.log("Team edited successfully.", response.data);
        setTeamName("");
        setSelectedPlayers([]);
        fetchTeams();
        onClose();
      })
      .catch((error) => {
        setError(
          error?.response?.data?.players?.[0] ||
            error?.response?.data?.non_field_errors?.[0] ||
            "Something went wrong"
        );
        console.error(
          "Error editing team:",
          error.response ? error.response.data : error.message
        );
      });
  };

  return (
    <>
      <div className="backdrop" onClick={onClose}></div>
      <div className="modal">
        <form onSubmit={editTeam} className="space-y-2 text-white">
          <label>New team name:</label>
          <input
            className="mt-2 block w-full rounded-md px-3 py-1.5 text-base outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team Name..."
            required
          />
          <label>Search for players:</label>
          <input
            className="mt-2 block w-full rounded-md px-3 py-1.5 text-base outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Players"
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
          <div className="">
            <ul>
              <p>Selected players:</p>
              {selectedPlayers.map((player) => (
                <li
                  key={player.id}
                  className="flex justify-between items-center p-2 bg-zinc-700 rounded-md mt-1"
                >
                  {player.username}
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(player)}
                    className="cursor-pointer hover:text-rose-400"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-red-500 mt-1">{error}</p>

          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
};

export default EditTeam;
