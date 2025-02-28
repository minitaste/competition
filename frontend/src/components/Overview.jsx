import React, { useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import FinishTournament from "./FinishTournament";
import { AuthContext } from "../AuthContext";

const Overview = ({ tournament, isOver }) => {
  const { user } = useContext(AuthContext);

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
            <p>Finished: {isOver ? <>Yes</> : <>No</>}</p>
          </div>
          {user.username === tournament.organizer && (
            <div className="text-center">
              <FinishTournament />
            </div>
          )}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};
export default Overview;
