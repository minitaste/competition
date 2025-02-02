import api from "../api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="text-center text-3xl text-white">
      <h2>Tournaments</h2>
      {tournaments.map((tournament) => (
        <div key={tournament.start}>
          <p>Tournament name: {tournament.name}</p>
          <p>Date: {tournament.start}</p>
          <p>{tournament.teams}</p>
        </div>
      ))}
    </div>
  );
};

export default Tournaments;
