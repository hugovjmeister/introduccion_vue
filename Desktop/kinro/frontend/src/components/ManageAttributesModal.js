// src/components/ManageAttributesModal.js
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { updateAttribute, deleteAttribute, createProperty, deleteProperty, createAttribute } from "../api";
import { dataTypes, dataTypeLabels } from "../constants/dataTypes";
import { propertyOptions } from "../constants/propertyOptions";
import ConfirmationModal from "./ConfirmationModal"; // Importamos el modal de confirmación
import useConfirmation from "../hooks/useConfirmation"; // Importamos el hook

function ManageAttributesModal({ nodeId, attributes, onClose, onReload }) {
  const [editingAttrId, setEditingAttrId] = useState(null);
  const [editAttrName, setEditAttrName] = useState("");
  const [editAttrType, setEditAttrType] = useState("");
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrType, setNewAttrType] = useState("");
  const [newProperties, setNewProperties] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Usamos el hook useConfirmation para manejar confirmaciones
  const { confirm, isOpen: isConfirmOpen, handleConfirm, handleClose } = useConfirmation();

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

  const handleEditAttribute = async (attrId) => {
    const validationError = validateAttributeName(editAttrName);
    if (validationError) {
      setError(validationError);
      toast.error(validationError, { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      await updateAttribute(attrId, { name: editAttrName, data_type: editAttrType });
      toast.success("Atributo actualizado exitosamente", { position: "top-right" });
      setEditingAttrId(null);
      setEditAttrName("");
      setEditAttrType("");
      onReload();
    } catch (error) {
      toast.error("Error al actualizar el atributo", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttribute = async (attrId) => {
    const confirmed = await confirm(); // Usamos el hook para confirmar
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteAttribute(attrId);
      toast.success("Atributo eliminado exitosamente", { position: "top-right" });
      onReload();
    } catch (error) {
      toast.error("Error al eliminar el atributo", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async (attributeId) => {
    const prop = newProperties[attributeId] || { name: "", value: "" };
    if (!prop.name || !prop.value) {
      toast.error("Debe ingresar nombre y valor para la propiedad.", { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      await createProperty({ attribute_id: attributeId, name: prop.name, value: prop.value });
      toast.success("Propiedad agregada exitosamente", { position: "top-right" });
      setNewProperties((prev) => {
        const updated = { ...prev };
        delete updated[attributeId];
        return updated;
      });
      onReload();
    } catch (error) {
      toast.error("Error al agregar la propiedad", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    const confirmed = await confirm(); // Usamos el hook para confirmar
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteProperty(propertyId);
      toast.success("Propiedad eliminada exitosamente", { position: "top-right" });
      onReload();
    } catch (error) {
      toast.error("Error al eliminar la propiedad", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const updateNewProperty = (attributeId, field, value) => {
    setNewProperties((prev) => ({
      ...prev,
      [attributeId]: {
        ...(prev[attributeId] || { name: "", value: "" }),
        [field]: value,
      },
    }));
  };

  const handleAddAttribute = async () => {
    const validationError = validateAttributeName(newAttrName);
    if (validationError) {
      setError(validationError);
      toast.error(validationError, { position: "top-right" });
      return;
    }

    if (!newAttrType.trim()) {
      toast.error("Debe seleccionar un tipo de dato.", { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      await createAttribute({
        name: newAttrName,
        data_type: newAttrType,
        class_id: nodeId,
      });
      toast.success("Atributo creado exitosamente", { position: "top-right" });
      setNewAttrName("");
      setNewAttrType("");
      setShowAddForm(false);
      setError("");
      onReload();
    } catch (error) {
      toast.error("Error al crear el atributo", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Modal para gestionar atributos"
      >
        <div
          className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4">Gestionar Atributos</h2>

          {/* Botón para mostrar el formulario de agregar atributo */}
          <button
            onClick={() => setShowAddForm(true)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            disabled={loading}
          >
            Agregar Atributo
          </button>

          {/* Formulario para agregar un nuevo atributo */}
          {showAddForm && (
            <div className="mb-4 p-4 border rounded-lg bg-gray-50">
              <div className="mb-4">
                <input
                  type="text"
                  value={newAttrName}
                  onChange={(e) => {
                    setNewAttrName(e.target.value);
                    setError("");
                  }}
                  className={`w-full p-2 border rounded ${
                    error ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Nombre del atributo"
                  disabled={loading}
                  aria-invalid={!!error}
                  aria-describedby={error ? "new-attr-name-error" : undefined}
                />
                {error && (
                  <p id="new-attr-name-error" className="text-red-500 text-xs mt-1">
                    {error}
                  </p>
                )}
              </div>
              <select
                value={newAttrType}
                onChange={(e) => setNewAttrType(e.target.value)}
                className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Seleccionar tipo</option>
                {dataTypes.map((dt) => (
                  <option key={dt} value={dt}>
                    {dataTypeLabels[dt]}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAddAttribute}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewAttrName("");
                    setNewAttrType("");
                    setError("");
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:bg-gray-400"
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Lista de atributos existentes */}
          {attributes.length === 0 ? (
            <p className="text-sm text-gray-600">No hay atributos para esta clase.</p>
          ) : (
            <ul className="space-y-4">
              {attributes.map((attr) => {
                const newProp = newProperties[attr.id] || { name: "", value: "" };
                return (
                  <li key={attr.id} className="border p-3 rounded-lg bg-gray-50">
                    {editingAttrId === attr.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editAttrName}
                          onChange={(e) => setEditAttrName(e.target.value)}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nombre del atributo"
                          disabled={loading}
                        />
                        <select
                          value={editAttrType}
                          onChange={(e) => setEditAttrType(e.target.value)}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        >
                          {dataTypes.map((dt) => (
                            <option key={dt} value={dt}>
                              {dataTypeLabels[dt]}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAttribute(attr.id)}
                            className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                            disabled={loading}
                          >
                            {loading ? "Guardando..." : "Guardar"}
                          </button>
                          <button
                            onClick={() => {
                              setEditingAttrId(null);
                              setEditAttrName("");
                              setEditAttrType("");
                            }}
                            className="text-gray-600 hover:text-gray-800 disabled:text-gray-400"
                            disabled={loading}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <strong>{attr.name}</strong> :{" "}
                            {dataTypeLabels[attr.data_type] || attr.data_type}
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setEditingAttrId(attr.id);
                                setEditAttrName(attr.name);
                                setEditAttrType(attr.data_type);
                              }}
                              className="text-yellow-600 hover:text-yellow-800 disabled:text-gray-400"
                              disabled={loading}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteAttribute(attr.id)}
                              className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                              disabled={loading}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <h4 className="text-sm font-semibold">Propiedades:</h4>
                          {attr.properties && attr.properties.length > 0 ? (
                            <ul className="ml-4 space-y-1">
                              {attr.properties.map((prop) => (
                                <li
                                  key={prop.id}
                                  className="flex justify-between text-xs"
                                >
                                  <span>
                                    {propertyOptions[prop.name] || prop.name}:{" "}
                                    {prop.value}
                                  </span>
                                  <button
                                    onClick={() => handleDeleteProperty(prop.id)}
                                    className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                                    disabled={loading}
                                  >
                                    Eliminar
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-gray-500">
                              Sin propiedades
                            </p>
                          )}
                          <div className="mt-2 flex gap-2">
                            <select
                              value={newProp.name}
                              onChange={(e) =>
                                updateNewProperty(attr.id, "name", e.target.value)
                              }
                              className="p-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={loading}
                            >
                              <option value="">Seleccionar propiedad</option>
                              {Object.entries(propertyOptions).map(
                                ([key, label]) => (
                                  <option key={key} value={key}>
                                    {label}
                                  </option>
                                )
                              )}
                            </select>
                            <input
                              type="text"
                              value={newProp.value}
                              onChange={(e) =>
                                updateNewProperty(attr.id, "value", e.target.value)
                              }
                              className="p-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Valor"
                              disabled={loading}
                            />
                            <button
                              onClick={() => handleAddProperty(attr.id)}
                              className="text-green-600 hover:text-green-800 disabled:text-gray-400"
                              disabled={loading}
                            >
                              Agregar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:bg-gray-400"
              disabled={loading}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Añadimos el ConfirmationModal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este elemento?"
      />
    </div>
  );
}

export default ManageAttributesModal;