// ✅ src/components/DataGridModal.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Delete, FileDownload } from "@mui/icons-material";
import {
  fetchClassData,
  updateClassData,
  deleteDataBatch,
  createDataBatch,
} from "../api";
import * as XLSX from "xlsx";

function DataGridModal({ open, onClose, nodes }) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const node = nodes[0];
  const classId = node?.id;

  useEffect(() => {
    if (!open || !classId) return;

    const loadData = async () => {
      try {
        const classData = await fetchClassData(classId);

        if (!classData || classData.length === 0) {
          setRows([]);
          setColumns([]);
          return;
        }

        const columnSet = new Set();
        classData.forEach((dataItem) =>
          Object.keys(dataItem.content).forEach((key) => columnSet.add(key))
        );

        const dynamicColumns = Array.from(columnSet).map((key) => ({
          field: key,
          headerName: key,
          width: 150,
          editable: true,
        }));

        const formattedRows = classData.map((dataItem) => ({
          id: dataItem.id,
          classId: dataItem.class_id,
          ...dataItem.content,
        }));

        setColumns(dynamicColumns);
        setRows(formattedRows);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setRows([]);
        setColumns([]);
      }
    };

    loadData();
  }, [open, classId]);

  const handleProcessRowUpdate = async (newRow, oldRow) => {
    try {
      const updatedContent = { ...newRow };
      delete updatedContent.id;
      delete updatedContent.classId;
      await updateClassData(newRow.id, updatedContent);
      return newRow;
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("No se pudo actualizar el dato: " + error.message);
      return oldRow;
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    if (!window.confirm("¿Eliminar los registros seleccionados?")) return;

    try {
      await deleteDataBatch(selectedIds);
      setRows((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
      setSelectedIds([]);
      setSnackbar({ open: true, message: `${selectedIds.length} registros eliminados con éxito`, severity: "success" });
    } catch (error) {
      console.error("Error al eliminar registros:", error);
      setSnackbar({ open: true, message: "Error al eliminar registros", severity: "error" });
    }
  };

  const handleExport = () => {
    if (rows.length === 0) return;

    const exportData = rows.map(({ id, classId, ...content }) => content);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    XLSX.writeFile(workbook, `${node.data.label || "Clase"}_datos.xlsx`);
  };

  const handleAddRow = async () => {
    const newRow = {
      id: `temp-${Date.now()}`,
      classId: classId,
    };

    columns.forEach((col) => {
      newRow[col.field] = "";
    });

    setRows((prev) => [...prev, newRow]);
  };

  const handleSaveNewRows = async () => {
    const newRows = rows.filter((row) => String(row.id).startsWith("temp-"));

    if (newRows.length === 0) return;

    const dataToCreate = newRows.map((row) => {
      const { id, classId, ...content } = row;
      return { class_id: classId, content };
    });

    try {
      await createDataBatch(dataToCreate);
      setSnackbar({ open: true, message: `${newRows.length} registros creados correctamente`, severity: "success" });
      onClose();
    } catch (error) {
      console.error("Error al crear datos:", error);
      setSnackbar({ open: true, message: "Error al crear los nuevos registros", severity: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{node?.data.label}</DialogTitle>
      <DialogContent>
        {rows.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay datos cargados para esta clase.
          </p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-2">
                <Tooltip title="Eliminar seleccionados">
                  <IconButton
                    onClick={handleDeleteSelected}
                    disabled={selectedIds.length === 0}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Exportar a Excel">
                  <IconButton onClick={handleExport} color="primary">
                    <FileDownload />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Agregar nuevo registro">
                  <IconButton onClick={handleAddRow} color="success">
                    <Add />
                  </IconButton>
                </Tooltip>
              </div>
              <Button onClick={handleSaveNewRows} variant="outlined" size="small">
                Guardar nuevos registros
              </Button>
            </div>

            <div style={{ height: 450, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={(ids) => setSelectedIds(ids)}
                processRowUpdate={handleProcessRowUpdate}
                onProcessRowUpdateError={(error) =>
                  console.error("Error al actualizar fila:", error)
                }
                experimentalFeatures={{ newEditingApi: true }}
              />
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default DataGridModal;