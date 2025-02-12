import React, { useState } from "react";
import ScheduleMatches from "./ScheduleMatches";
import Overview from "./Overview";
import Teams from "./Teams";

const Participate = () => {
  
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="py-1 px-4">
      <div className="text-white">
        <h1></h1>
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
            onClick={() => setActiveTab("schedule")}
            className={`h-18 w-34 hover:cursor-pointer ${
              activeTab === "schedule"
                ? "bg-zinc-600 border border-indigo-500"
                : ""
            }`}
          >
            Schedule
          </button>
        </div>

        <div>
          {activeTab === "overview" && <Overview />}
          {activeTab === "teams" && <Teams />}
          {activeTab === "schedule" && <ScheduleMatches />}
        </div>
      </div>
    </div>
  );
};

export default Participate;
