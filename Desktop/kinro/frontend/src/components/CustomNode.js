// src/components/CustomNode.js
import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { FaDownload, FaUpload, FaTable } from "react-icons/fa";
import * as XLSX from "xlsx";
import DataGridModal from "./DataGridModal";

const dataTypeLabels = {
  integer: "Número",
  text: "Texto",
  boolean: "Activo/Inactivo",
  date: "Fecha",
  float: "Decimal",
  json: "Objeto JSON",
  uuid: "Identificador Único",
};

const propertyLabels = {
  max_length: "Máx. caracteres",
  min_length: "Mín. caracteres",
  no_special_chars: "Sin caracteres especiales",
  required: "Requerido",
};

const relationshipStyles = {
  "1-1": { icon: "—", color: "text-blue-500" },
  "1-N": { icon: "→", color: "text-green-500" },
  "N-N": { icon: "↔", color: "text-orange-500" },
};

function CustomNode({ data, id }) {
  const [dataGridModalOpen, setDataGridModalOpen] = useState(false);

  const handleDoubleClick = (attr) => {
    console.log("Doble clic en atributo:", attr);
    if (data.onAttributeDoubleClick) {
      data.onAttributeDoubleClick(attr);
    }
  };

  const handleDownloadExcel = () => {
    if (!data.attributes || data.attributes.length === 0) {
      alert("Esta clase no tiene atributos para exportar.");
      return;
    }
    const headers = data.attributes.map((attr) => attr.name);
    const worksheetData = [headers];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, data.label || "Clase");
    XLSX.writeFile(workbook, `${data.label || "clase"}-template.xlsx`);
  };

  const hasAttributes = data.attributes && data.attributes.length > 0;
  const incomingConnections = (data.edges || []).filter((edge) => edge.target === id);

  return (
    <div className="bg-white border border-gray-300 p-3 rounded shadow-md w-56 flex flex-col">
      <div className="font-bold text-center mb-3">{data.label}</div>

      {hasAttributes && (
        <div className="w-full mb-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Atributos:
        </div>
      )}

      {hasAttributes && (
        <div className="flex flex-col gap-3 w-full mb-2">
          {data.attributes.map((attr) => (
            <div
              key={attr.id}
              className="bg-white border border-gray-200 rounded px-2 py-1 text-sm text-gray-700 shadow hover:shadow-md transition-shadow duration-150 cursor-pointer"
              onDoubleClick={() => handleDoubleClick(attr)}
              title="Doble clic para editar"
            >
              <span className="text-base font-semibold">{attr.name}</span>
              <span className="block text-xs text-gray-500">
                {dataTypeLabels[attr.data_type] || attr.data_type}
              </span>
              {attr.properties && attr.properties.length > 0 && (
                <ul className="mt-1 text-xs text-gray-400">
                  {attr.properties.map((prop) => (
                    <li key={prop.id}>
                      {propertyLabels[prop.name] || prop.name}: {prop.value}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {incomingConnections.length > 0 && (
        <div className="mb-2">
          <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Relaciones entrantes:
          </div>
          {incomingConnections.map((conn) => {
            const sourceNode = (data.nodes || []).find((n) => n.id === conn.source);
            const sourceName = sourceNode && sourceNode.data ? sourceNode.data.label : "Desconocido";
            const relStyle = relationshipStyles[conn.label] || { icon: "?", color: "text-gray-500" };
            return (
              <div key={conn.id} className={`text-sm ${relStyle.color}`}>
                <span>{relStyle.icon} </span>
                <span>{sourceName}</span>
              </div>
            );
          })}
        </div>
      )}

      {hasAttributes && (
        <div className="mt-3 flex justify-center gap-4">
          <button
            onClick={handleDownloadExcel}
            className="text-green-600 hover:text-green-800"
            title="Descargar plantilla Excel"
          >
            <FaDownload />
          </button>
          <button
            onClick={() => data.onOpenUploadModal(id, data.attributes)}
            className="text-blue-600 hover:text-blue-800"
            title="Cargar datos desde Excel"
          >
            <FaUpload />
          </button>
          <button
            onClick={() => setDataGridModalOpen(true)}
            className="text-purple-600 hover:text-purple-800"
            title="Ver datos cargados"
          >
            <FaTable />
          </button>
        </div>
      )}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <DataGridModal
        open={dataGridModalOpen}
        onClose={() => setDataGridModalOpen(false)}
        nodes={[{ id, data }]}
      />
    </div>
  );
}

export default CustomNode;