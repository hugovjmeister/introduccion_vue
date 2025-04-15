// src/components/UploadExcelModal.js
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { createDataBatch } from "../api";

function isExcelDate(value) {
  return typeof value === "number" && value > 59 && value < 60000;
}

function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  return new Date(utc_value * 1000);
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function UploadExcelModal({ nodeId, attributes, onClose, onReload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [processedRecords, setProcessedRecords] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo Excel.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setProcessedRecords(0);
    setStartTime(Date.now());

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = jsonData[0];
      const rows = jsonData.slice(1).filter((row) =>
        row.some((cell) => cell !== undefined && cell !== "")
      );
      setTotalRecords(rows.length);

      const validAttributes = attributes.map((attr) => attr.name);
      const allData = rows.map((row) => {
        const content = {};
        headers.forEach((header, index) => {
          let cellValue = row[index];
          if (validAttributes.includes(header)) {
            if (isExcelDate(cellValue)) {
              const dateObj = excelDateToJSDate(cellValue);
              content[header] = formatDate(dateObj);
            } else {
              content[header] = cellValue !== undefined ? String(cellValue) : "";
            }
          }
        });
        return {
          class_id: String(nodeId),
          content,
        };
      });

      try {
        await createDataBatch(allData);
        setProcessedRecords(rows.length);
        setProgress(100);
        alert("Datos cargados exitosamente");
        onReload();
        onClose();
      } catch (error) {
        console.error("Error uploading data:", error);
        alert(error.message || "No se pudieron guardar los datos.");
      } finally {
        setUploading(false);
        setProgress(0);
        setProcessedRecords(0);
        setTotalRecords(0);
        setStartTime(null);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const elapsedTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Cargar Datos desde Excel</h2>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="mb-4 w-full"
          disabled={uploading}
        />
        {uploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Procesando {processedRecords} de {totalRecords} registros...
            </p>
            <p className="text-sm text-gray-600">
              Tiempo transcurrido: {elapsedTime} segundos
            </p>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={uploading}
          >
            {uploading ? "Cargando..." : "Cargar"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={uploading}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadExcelModal;
