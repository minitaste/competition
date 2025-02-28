import React, { useContext, useEffect, useState } from "react";
import Overview from "./Overview";
import Teams from "./Teams";
import Results from "./Results";
import { useParams } from "react-router-dom";
import api from "../api";

const Participate = () => {
  const { tournamentId } = useParams();

  const [activeTab, setActiveTab] = useState("overview");

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
        setIsOver(response.data[0].is_over);
        console.log(response.data[0]);
        console.log(isOver);
      } catch (error) {
        console.error("Error fetching tournament:", error);
      }
    };

  return (
    <div className="py-1 px-4">
      <div className="text-white">
        <div className="m-2 flex justify-center text-3xl border border-gray-700 bg-zinc-900/70">
          <button
            onClick={() => setActiveTab("overview")}
            className={`h-18 w-34 hover:cursor-pointer ${
              activeTab === "overview"
                ? "bg-zinc-600 border border-indigo-500"
                : ""
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("teams")}
            className={`h-18 w-34 hover:cursor-pointer ${
              activeTab === "teams"
                ? "bg-zinc-600 border border-indigo-500"
                : ""
            }`}
          >
            Teams
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`h-18 w-34 hover:cursor-pointer ${
              activeTab === "results"
                ? "bg-zinc-600 border border-indigo-500"
                : ""
            }`}
          >
            Results
          </button>
        </div>

        <div>
          {activeTab === "overview" && (
            <Overview tournament={tournament} isOver={isOver} />
          )}
          {activeTab === "teams" && (
            <Teams />
          )}
          {activeTab === "results" && (
            <Results tournamentOrganizer={tournament.organizer}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default Participate;
