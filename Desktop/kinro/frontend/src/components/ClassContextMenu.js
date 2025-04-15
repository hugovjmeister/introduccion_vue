// src/components/ClassContextMenu.js
import React from "react";
import { FaPlus, FaCopy, FaEdit, FaTrash, FaList } from "react-icons/fa";

function ClassContextMenu({
  x,
  y,
  nodeId,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onManageAttributes,
  onDuplicateClass,
}) {
  return (
    <div
      style={{ top: y, left: x }}
      className="absolute bg-white rounded-lg shadow-xl border p-2 z-50"
    >
      <ul className="text-sm">
        {!nodeId ? (
          <li>
            <button
              onClick={onAddClass}
              className="flex items-center w-full p-2 hover:bg-gray-100"
            >
              <FaPlus className="mr-2" /> Nueva Clase
            </button>
          </li>
        ) : (
          <>
            <li>
              <button
                onClick={onDuplicateClass}
                className="flex items-center w-full p-2 hover:bg-gray-100"
              >
                <FaCopy className="mr-2" /> Duplicar
              </button>
            </li>
            <li>
              <button
                onClick={onEditClass}
                className="flex items-center w-full p-2 hover:bg-gray-100"
              >
                <FaEdit className="mr-2" /> Editar
              </button>
            </li>
            <li>
              <button
                onClick={onManageAttributes}
                className="flex items-center w-full p-2 hover:bg-gray-100"
              >
                <FaList className="mr-2" /> Atributos
              </button>
            </li>
            <li>
              <button
                onClick={onDeleteClass}
                className="flex items-center w-full p-2 hover:bg-gray-100 text-red-600"
              >
                <FaTrash className="mr-2" /> Eliminar
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default ClassContextMenu;