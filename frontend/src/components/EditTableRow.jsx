import React, { useContext, useState } from "react";
import api from "../api";
import { AuthContext } from "../AuthContext";

const EditTableRow = ({ stats, onUpdate, setStatsUpdate }) => {
    const {user} = useContext(AuthContext)
    
  const [points, setPoints] = useState(stats.points);
  const [assists, setAssists] = useState(stats.assists);
  const [rebounds, setRebounds] = useState(stats.rebounds);
  const [steals, setSteals] = useState(stats.steals);
  const [blocks, setBlocks] = useState(stats.blocks);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
    

  const handleSave = async () => {
    setLoading(true);

    try {
      const payload = {
        points,
        assists,
        rebounds,
        steals,
        blocks,
      };

      const response = await api.patch(
        `/api/tournaments/participate/statistic/${stats.id}/`,
        payload
      );
      console.log(response.data);
      setEditing(false);
      setStatsUpdate(prev => !prev); 
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPoints(stats.points);
    setAssists(stats.assists);
    setRebounds(stats.rebounds);
    setSteals(stats.steals);
    setBlocks(stats.blocks);
    setEditing(false);
    };
    

  return (
    <tr className="bg-zinc-900 text-white">
      <td className="p-2 border">{stats.player}</td>
      <td className="p-2 border text-center">
        {editing ? (
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="w-full text-center"
          />
        ) : (
          stats.points
        )}
      </td>
      <td className="p-2 border text-center">
        {editing ? (
          <input
            type="number"
            value={assists}
            onChange={(e) => setAssists(e.target.value)}
            className="w-full text-center"
          />
        ) : (
          stats.assists
        )}
      </td>
      <td className="p-2 border text-center">
        {editing ? (
          <input
            type="number"
            value={rebounds}
            onChange={(e) => setRebounds(e.target.value)}
            className="w-full text-center"
          />
        ) : (
          stats.rebounds
        )}
      </td>
      <td className="p-2 border text-center">
        {editing ? (
          <input
            type="number"
            value={steals}
            onChange={(e) => setSteals(e.target.value)}
            className="w-full text-center"
          />
        ) : (
          stats.steals
        )}
      </td>
      <td className="p-2 border text-center">
        {editing ? (
          <input
            type="number"
            value={blocks}
            onChange={(e) => setBlocks(e.target.value)}
            className="w-full text-center"
          />
        ) : (
          stats.blocks
        )}
      </td>
          {user && (
              
          <td className="p-2 border text-center">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-2 py-1 bg-green-600 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-2 py-1 bg-red-600 rounded hover:bg-red-700 ml-2"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-2 py-1 bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Edit
          </button>
        )}
      </td>
      )}
    </tr>
  );
};

export default EditTableRow;