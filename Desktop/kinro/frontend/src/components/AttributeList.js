// src/components/AttributeList.js
import React, { useState } from "react";
import EditAttributeModal from "./EditAttributeModal";
import { dataTypeLabels } from "../constants/dataTypes"; // Importamos las constantes

function AttributeList({ attributes, onUpdateAttribute }) {
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDoubleClick = (attribute) => {
    setSelectedAttribute(attribute);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (attribute) => {
    setSelectedAttribute(attribute);
    setIsEditModalOpen(true);
  };

  const handleClose = () => {
    setIsEditModalOpen(false);
    setSelectedAttribute(null);
  };

  const handleUpdate = (id, name, dataType) => {
    onUpdateAttribute(id, name, dataType);
    handleClose();
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Atributos</h2>
      {attributes.length === 0 ? (
        <p className="text-gray-500 italic">No hay atributos para mostrar.</p>
      ) : (
        <ul className="space-y-2">
          {attributes.map((attr) => (
            <li
              key={attr.id}
              onDoubleClick={() => handleDoubleClick(attr)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleDoubleClick(attr);
                  e.preventDefault();
                }
              }}
              className="flex justify-between items-center p-2 rounded hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              tabIndex={0} // Hace que el elemento sea enfocable
              role="button"
              aria-label={`Editar atributo ${attr.name}`}
            >
              <span>
                {attr.name} ({dataTypeLabels[attr.data_type] || "Desconocido"})
              </span>
              <button
                onClick={() => handleEditClick(attr)}
                className="text-blue-600 hover:text-blue-800"
                aria-label={`Editar atributo ${attr.name}`}
              >
                ✏️
              </button>
            </li>
          ))}
        </ul>
      )}

      {isEditModalOpen && (
        <EditAttributeModal
          attribute={selectedAttribute}
          onClose={handleClose}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
}

export default AttributeList;