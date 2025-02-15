import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import Loading from "./Loading";

const Overview = () => {
  const { tournamentId } = useParams();

  const [tournament, setTournament] = useState(null);
  const [isOver, setIsOver] = useState(false);
  
  useEffect(() => {
    getTournament();
  }, []);

  const getTournament = async () => {
    try {
      const response = await api.get(
        `/api/tournaments/?tournament=${tournamentId}`
      );
      setTournament(response.data[0]);
      setIsOver(response.data[0].is_over)
      console.log(response.data[0]);
      console.log(isOver)
    } catch (error) {
      console.error("Error fetching tournament:", error);
    }
  };
  
  return (
    <div className="text-white">
      {tournament ? (
        <>
          <h1 className="text-2xl flex justify-center">
            {tournament.name}
            <img src="/trophy-overview.svg" className="size-8" />
          </h1>
          <div className="p-4 border border-gray-700 bg-zinc-900/70">
            <p className="flex">
              Location: {tournament.location}
              <img src="/location.svg" />
            </p>
            <p>Start date: {tournament.start}</p>
            <p>Organizer: {tournament.organizer}</p>

          </div>
        </>
      ) : (
        <Loading />
      )}
      
    </div>
  );
};
export default Overview;
