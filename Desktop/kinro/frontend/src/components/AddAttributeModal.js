// src/components/AddAttributeModal.js
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { dataTypes, dataTypeLabels } from "../constants/dataTypes"; // Importamos las constantes

function AddAttributeModal({ nodeId, onClose, onSubmit }) {
  const [attrName, setAttrName] = useState("");
  const [attrType, setAttrType] = useState(dataTypes[0]);
  const [error, setError] = useState(""); // Estado para manejar errores

  // Manejo del cierre con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Función para validar el nombre del atributo
  const validateAttributeName = useCallback((name) => {
    if (!name.trim()) {
      return "El nombre del atributo no puede estar vacío.";
    }
    if (name.length > 50) {
      return "El nombre del atributo no puede tener más de 50 caracteres.";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      return "El nombre del atributo solo puede contener letras, números y guiones bajos.";
    }
    return "";
  }, []);

  const handleSave = async () => {
    const validationError = validateAttributeName(attrName);
    if (validationError) {
      setError(validationError);
      toast.error(validationError, { position: "top-right" });
      return;
    }

    try {
      setError(""); // Limpiamos el error si la validación pasa
      await onSubmit(nodeId, attrName.trim(), attrType); // Llamamos a onSubmit
      toast.success("Atributo guardado exitosamente", { position: "top-right" });
      onClose(); // Cerramos el modal después de guardar
    } catch (error) {
      toast.error("Error al guardar el atributo", { position: "top-right" });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose} // Clic fuera del modal para cerrar
      role="dialog"
      aria-modal="true"
      aria-label="Modal para agregar atributo"
    >
      <div
        className="bg-white rounded-lg p-6 w-96 max-w-[90vw] shadow-xl"
        onClick={(e) => e.stopPropagation()} // Evitamos que el clic dentro del modal lo cierre
      >
        <h2 className="text-xl font-bold mb-4">Agregar Atributo</h2>

        <div className="mb-4">
          <label
            htmlFor="attr-name"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Nombre del atributo
          </label>
          <input
            id="attr-name"
            type="text"
            value={attrName}
            onChange={(e) => {
              setAttrName(e.target.value);
              setError(""); // Limpiamos el error al escribir
            }}
            className={`block w-full border rounded p-2 ${
              error ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Ej: edad"
            aria-invalid={!!error}
            aria-describedby={error ? "attr-name-error" : undefined}
          />
          {error && (
            <p id="attr-name-error" className="text-red-500 text-xs mt-1">
              {error}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="attr-type"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Tipo de dato
          </label>
          <select
            id="attr-type"
            value={attrType}
            onChange={(e) => setAttrType(e.target.value)}
            className="block w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {dataTypes.map((dt) => (
              <option key={dt} value={dt}>
                {dataTypeLabels[dt]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            aria-label="Cancelar"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label="Guardar atributo"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddAttributeModal;