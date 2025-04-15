// src/components/EdgeContextMenu.js
import React from "react";
import { FaTrash } from "react-icons/fa";

function EdgeContextMenu({ x, y, edgeId, onDelete }) {
  return (
    <div
      style={{ top: y, left: x }}
      className="absolute bg-white rounded-lg shadow-xl border p-2 z-50"
    >
      <button
        onClick={() => onDelete(edgeId)}
        className="flex items-center w-full p-2 hover:bg-gray-100 text-red-600"
      >
        <FaTrash className="mr-2" /> Eliminar conexión
      </button>
    </div>
  );
}

export default EdgeContextMenu;