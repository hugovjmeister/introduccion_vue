// src/components/EditAttributeModal.js
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const dataTypeLabels = {
  integer: "Número",
  text: "Texto",
  boolean: "Activo/Inactivo",
  date: "Fecha",
  float: "Decimal",
  json: "Objeto JSON",
  uuid: "Identificador Único",
};

const dataTypes = Object.keys(dataTypeLabels);

function EditAttributeModal({ attribute, onClose, onSubmit }) {
  const [attrName, setAttrName] = useState(attribute.name);
  const [attrType, setAttrType] = useState(attribute.data_type);

  useEffect(() => {
    setAttrName(attribute.name);
    setAttrType(attribute.data_type);
  }, [attribute]);

  const handleSave = () => {
    if (!attrName.trim()) {
      toast.error("El nombre del atributo no puede estar vacío.", {
        position: "top-right",
      });
      return;
    }
    toast.success("Atributo actualizado exitosamente", {
      position: "top-right",
    });
    onSubmit(attribute.id, attrName.trim(), attrType);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow p-4 w-[300px]">
        <h2 className="text-lg font-bold mb-4">Editar Atributo</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Nombre del atributo
        </label>
        <input
          type="text"
          value={attrName}
          onChange={(e) => setAttrName(e.target.value)}
          className="block w-full mb-4 border border-gray-300 rounded p-2"
          placeholder="Ej: edad"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Tipo de dato
        </label>
        <select
          value={attrType}
          onChange={(e) => setAttrType(e.target.value)}
          className="block w-full mb-4 border border-gray-300 rounded p-2"
        >
          {dataTypes.map((dt) => (
            <option key={dt} value={dt}>
              {dataTypeLabels[dt]}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditAttributeModal;