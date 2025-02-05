import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";

const Participate = ({}) => {
  const { tournamentId } = useParams();
  const [tournament, setTornament] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);

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

  const createTeam = (e) => {
    e.preventDefault();
    const playersIds = selectedPlayers.map((player) => player.id);

    api
      .post(`/api/teams/`, {
        name: teamName,
        players: playersIds,
      })
      .then((response) => {
        console.log("Team added successfuly.", response.data);
        const newTeamId = response.data.id;
        addTeam(newTeamId);
        setTeamName("");
        setSelectedPlayers([]);
      })
      .catch((error) =>
        console.error(
          "Error adding team:",
          error.response ? error.response.data : error.message
        )
      );
  };

  const addTeam = (teamId) => {
    api
      .patch(`/api/tournaments/${tournamentId}/participate/`, {
        teams: [teamId],
      })
      .then((response) => console.log("Success.", response.data))
      .catch((error) => {
        console.error(
          "Error updating tournament:",
          error.response ? error.response.data : error.message
        );
      });
  };

  return (
    <div className="text-3xl">
      {/* <Tournament tournamentId={tournamentId} /> */}
      <form onSubmit={createTeam}>
        <input
          className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team Name..."
          required
        />
        <input
          className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Players"
        />
        <ul>
          {filteredPlayers.map((player) => (
            <li
              key={player.id}
              onClick={() => handleSelectPlayer(player)}
              className="cursor-pointer hover:bg-gray-100 p-2"
            >
              {player.username}
            </li>
          ))}
        </ul>
        <div className="">
          <ul>
            {selectedPlayers.map((player) => (
              <li
                key={player.id}
                className="flex justify-between items-center p-2 bg-gray-100 rounded-md mt-1"
              >
                {player.username}
                <button
                  type="button"
                  onClick={() => handleRemovePlayer(player)}
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
  );
};

export default Participate;
