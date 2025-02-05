import React, { useState } from "react";
import api from "../api";


const CreateTournament = ({ onSuccess }) => {
  const [tournamentName, setTournamentName] = useState("");
  const [start, setStart] = useState();
  const [teamsLimit, setTeamsLimit] = useState();
  const [location, setLocation] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post(`/api/tournaments/`, {
        name: tournamentName,
        start,
        teams_limit: teamsLimit,
        location,
      })
      .then((response) => {
        console.log(response.data);
        onSuccess();
      })
      .catch((error) => {
        console.error(
          "Error creating tournament:",
          error.response ? error.response.data : error.message
        );
      });
  };

  return (
    <div className="text-white">
      <form onSubmit={handleSubmit}>
        <input
          className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          type="text"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
          placeholder="Tournament Name..."
          required
        />
        <input
          className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
        <input
          className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          type="number"
          value={teamsLimit}
          onChange={(e) => setTeamsLimit(e.target.value)}
          placeholder="Teams limit (max: 32)"
          required
        />
        <input
          className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location..."
          required
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};
export default CreateTournament;
