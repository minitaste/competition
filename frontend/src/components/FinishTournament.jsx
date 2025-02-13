import React from "react";
import api from "../api";
import { useParams } from "react-router-dom";

const FinishTournament = () => {
  const { tournamentId } = useParams();

  const finish = () => {
    try {
      const response = api.patch(`/api/tournaments/finish/${tournamentId}/`);
      console.log(response.data)
    } catch (error) {
      console.error("Error with finish tournament...", error);
    }
  };

  return (
      <div className="text-white">
          
      <button onClick={finish}>Finish Tournament...</button>
    </div>
  );
};

export default FinishTournament;
