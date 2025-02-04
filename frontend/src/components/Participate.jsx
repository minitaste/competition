import React, { useState } from "react";
import api from "../api";

const Participate = ({ tournament }) => {
  const [teamName, setTeamName] = useState("");

  const addTeam = (e) => {
    e.preventDefault();
    api
      .patch(`/api/tournaments/${tournament.id}/participate/`, {
        team_name: teamName,
    })
    .then((response) => {
        console.log("Team added successfuly.", response.data);
        setTeamName("");
      })
      .catch((error) =>
        console.error(
          "Error adding team:",
          error.response ? error.response.data : error.message
        )
      );
  };

  return (
    <div className="text-3xl">
      <form onSubmit={addTeam}>
        <input
          className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team Name..."
          required
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Participate;
