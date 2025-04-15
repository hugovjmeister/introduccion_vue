// src/components/ClassModal.js
import React, { useState, useEffect } from "react";
import ManageAttributesModal from "./ManageAttributesModal";
import { createClass } from "../api";

function ClassModal({ type, nodeId, nodes, onClose, onCreate, onEdit, onDelete, onConnect, onReload }) {
  const [className, setClassName] = useState("");
  const [relationshipType, setRelationshipType] = useState("1-1");
  const node = nodes.find((n) => n.id === nodeId);

  useEffect(() => {
    if (type === "edit" && node) setClassName(node.data.label);
  }, [type, node]);

  const handleSubmit = () => {
    switch (type) {
      case "create":
        onCreate(className);
        break;
      case "edit":
        onEdit(nodeId, className);
        break;
      case "duplicate":
        createClass({ name: `${node.data.label} (Copia)` }).then(onReload);
        onClose();
        break;
      case "delete":
        onDelete(nodeId);
        break;
      case "connect":
        onConnect(relationshipType);
        break;
      default:
        break;
    }
  };

  const titles = {
    create: "Nueva Clase",
    edit: "Editar Clase",
    delete: "Confirmar Eliminación",
    attributes: "Gestionar Atributos",
    duplicate: "Duplicar Clase",
    connect: "Definir Relación",
  };

  if (type === "attributes") {
    return (
      <ManageAttributesModal
        nodeId={nodeId}
        attributes={node?.data.attributes || []}
        onClose={onClose}
        onReload={onReload}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{titles[type]}</h2>
        
        {type === "delete" ? (
          <p>¿Seguro que desea eliminar esta clase?</p>
        ) : type === "connect" ? (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tipo de relación
            </label>
            <select
              value={relationshipType}
              onChange={(e) => setRelationshipType(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="1-1">Uno a Uno (1-1)</option>
              <option value="1-N">Uno a Muchos (1-N)</option>
              <option value="N-N">Muchos a Muchos (N-N)</option>
            </select>
          </div>
        ) : type !== "duplicate" ? (
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="Nombre de la clase"
          />
        ) : null}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!className.trim() && type !== "delete" && type !== "duplicate" && type !== "connect"}
          >
            {type === "delete" ? "Eliminar" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClassModal;