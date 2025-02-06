import React, { useEffect, useState } from "react";
import api from "../api";

const CreateTeam = ({ fetchTeams, tournamentId, onClose }) => {
  const [search, setSearch] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState([]);

  const createTeam = (e) => {
    e.preventDefault();
    const playersIds = selectedPlayers.map((player) => player.id);

    api
      .post(`/api/teams/`, {
        name: teamName,
        tournament: tournamentId,
        players: playersIds,
      })
      .then((response) => {
        console.log("Team added successfuly.", response.data);
        setTeamName("");
        setSelectedPlayers([]);
        fetchTeams();
        onClose();
      })
      .catch((error) =>
        console.error(
          "Error adding team:",
          error.response ? error.response.data : error.message
        )
      );
  };

  useEffect(() => {
    get_users();
  }, []);

  const filteredPlayers = players.filter((player) =>
    player.username.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleSelectPlayer = (player) => {
    if (!selectedPlayers.includes(player)) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleRemovePlayer = (player) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
  };

  return (
    <>
      <div className="backdrop" onClick={onClose}></div>
      <div className="modal">
        <form onSubmit={createTeam} className="space-y-2 text-white">
          <label>Team name:</label>
          <input
            className="mt-2 block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team Name..."
            required
          />
          <label>Search for players:</label>
          <input
            className="mt-2 block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Players"
          />
          <ul className="border-y border-gray-300 py-2">
            {filteredPlayers.map((player) => (
              <li
                key={player.id}
                onClick={() => handleSelectPlayer(player)}
                className="cursor-pointer hover:bg-zinc-700 p-2 "
              >
                {player.username}
              </li>
            ))}
          </ul>
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

          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
};

export default CreateTeam;
