import React, { useEffect, useState } from "react";
import api from "../api";
import Participate from "./Participate";
import Loading from "./Loading";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTournaments();
  }, []);

  const getTournaments = async (e) => {
    setLoading(true);
    try {
      const response = await api.get("/api/tournaments/");
      const data = response.data;
      setTournaments(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-6 space-y-3 lg:px-8 text-white">
      <h2 className="text-center text-2xl">Tournaments</h2>
      {loading && <Loading />}
      {tournaments.map((tournament) => (
        <div
          className="flex p-2 w-full border border-gray-700 bg-zinc-900/70 "
          key={tournament.start}
        >
          <img
            src="tournament-logo.jpg"
            className="size-24 object-cover border drop-shadow-2xl"
          />
          <div className="ml-3 text-stone-300 w-full leading-4">
            <div className="flex justify-between">
              <p className="font-bold text-2xl">{tournament.name}</p>
              <p>Event start: {tournament.start}</p>
            </div>
            <p>Location: {tournament.location}</p>
            <div className="text-center mt-3 inline-block bg-black px-4 py-1 cursor-pointer rounded-lg text-white hover:text-gray-400 hover:drop-shadow-2xl transition-all duration-200 ease-in-out">
              <a className="text-2xl staatliches">Play</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tournaments;
