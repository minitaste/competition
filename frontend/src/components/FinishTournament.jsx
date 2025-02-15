import React, { useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";

const FinishTournament = () => {
  const { tournamentId } = useParams();

  const [error, setError] = useState("");

  const finish = async () => {
    try {
      const response = await api.patch(`/api/tournaments/finish/${tournamentId}/`);
      console.log(response.data);
    } catch (error) {
      setError(error.response.data.detail || "Error FinishTournament.");
      console.error("Error with finish tournament...", error);
    }
  };

  return (
    <div className="text-white">
        <p className="text-red-500 mt-1">{error}</p>
      <button
        onClick={finish}
        className="px-4 pr-3 py-2 my-1 rounded-2xl text-xl cursor-pointer items-center bg-indigo-800 hover:bg-indigo-900 text-stone-100"
      >
        Finish Tournament...
      </button>
    </div>
  );
};

export default FinishTournament;
