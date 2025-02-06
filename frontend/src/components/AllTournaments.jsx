import React, { useEffect, useState } from "react";
import api from "../api";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import CreateTournament from "./CreateTournament";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const handleSuccess = () => {
    setSuccess(true);
    getTournaments();
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col px-6 space-y-3 lg:px-8 text-white">
      <button
        className="ml-auto px-4 pr-3 py-2 mt-4 rounded-2xl flex justify-end text-xl cursor-pointer items-center bg-indigo-800 hover:bg-indigo-900 text-stone-100"
        onClick={() => setIsModalOpen(true)}
      >
        Create Tournament
        <img src="plus.svg" className="size-7 ml-1" />
      </button>

      {isModalOpen && (
        <CreateTournament
          onSuccess={handleSuccess}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <h2 className="text-center text-2xl">Tournaments</h2>
      {loading && <Loading />}
      {tournaments.map((tournament) => (
        <div
          className="flex p-2 w-full border border-gray-700 bg-zinc-900/70 "
          key={tournament.id}
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

            <Link
              to={`/participate/${tournament.id}`}
              state={{ tournament }}
            >
              <div className="text-center mt-3 inline-block bg-black px-4 py-1 cursor-pointer rounded-lg text-white hover:text-gray-400 hover:drop-shadow-2xl transition-all duration-200 ease-in-out">
                <span className="text-2xl staatliches">Play</span>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tournaments;
