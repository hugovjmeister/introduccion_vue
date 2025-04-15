const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"; 

export const fetchClasses = async () => {
  const response = await fetch(`${API_URL}/classes/`);
  if (!response.ok) throw new Error("Error al obtener las clases");
  return response.json();
};

export const createClass = async (classData) => {
  const response = await fetch(`${API_URL}/classes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(classData),
  });

  if (!response.ok) {
    throw new Error(`Error al crear la clase: ${response.statusText}`);
  }

  return response.json();
};

export const updateClassName = async (id, updateData) => {
  const response = await fetch(`${API_URL}/classes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: updateData.name }), // Explicitly send only name
  });
  if (!response.ok) throw new Error("Error al actualizar la clase");
  return response.json();
};

export const deleteClass = async (id) => {
  const response = await fetch(`${API_URL}/classes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar la clase");
};


export const updateClassPosition = async (id, position) => {
  const response = await fetch(`${API_URL}/classes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(position), // { position_x, position_y }
  });
  if (!response.ok) throw new Error("Error al actualizar la posición de la clase");
  return response.json();
};

export const createAttribute = async ({ class_id, name, data_type }) => {
  const response = await fetch(`${API_URL}/attributes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ class_id, name, data_type }), // Ajustado
  });
  if (!response.ok) throw new Error("Error al crear el atributo");
  return response.json();
};

export const updateAttribute = async (attributeId, updateData) => {
  const response = await fetch(`${API_URL}/attributes/${attributeId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) throw new Error("Error al actualizar atributo");
  return response.json();
};

export const deleteAttribute = async (attributeId) => {
  const response = await fetch(`${API_URL}/attributes/${attributeId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar atributo");
  return response.json();
};

export const createProperty = async ({ attribute_id, name, value }) => {
  const response = await fetch(`${API_URL}/properties/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attribute_id, name, value }),
  });
  if (!response.ok) throw new Error("Error al crear la propiedad");
  return response.json();
};

export const updateProperty = async (propertyId, updateData) => {
  const response = await fetch(`${API_URL}/properties/${propertyId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) throw new Error("Error al actualizar la propiedad");
  return response.json();
};

export const deleteProperty = async (propertyId) => {
  const response = await fetch(`${API_URL}/properties/${propertyId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar la propiedad");
  return response.json();
};

export const fetchConnections = async () => {
  const response = await fetch(`${API_URL}/connections/`);
  if (!response.ok) throw new Error("Error al obtener conexiones");
  return response.json();
};

export const createConnection = async ({ source_class, target_class, relationship_type }) => {
  const response = await fetch(`${API_URL}/connections/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source_class, target_class, relationship_type }),
  });
  if (!response.ok) throw new Error("Error al crear la conexión");
  return response.json();
};

export const deleteConnection = async (connectionId) => {
  const response = await fetch(`${API_URL}/connections/${connectionId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar la conexión");
  return response.json();
};

// Obtener los datos cargados para una clase específica
export const fetchClassData = async (classId) => {
  const response = await fetch(`${API_URL}/data/${classId}/data/`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al obtener los datos de la clase");
  }
  return response.json();
};

// Actualizar un registro de datos
export const updateClassData = async (dataId, updatedContent) => {
  const response = await fetch(`${API_URL}/data/${dataId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: updatedContent }),
  });
  if (!response.ok) throw new Error("Error al actualizar los datos");
  return response.json();
};

// Crear datos en lote
export const createDataBatch = async (dataList) => {
  const response = await fetch(`${API_URL}/data/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataList),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al crear los datos");
  }
  return response.json();
};

export const deleteData = async (dataId) => {
  const response = await fetch(`${API_URL}/data/${dataId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al eliminar la fila");
  }

  return response.json();
};

export const deleteDataBatch = async (ids) => {
  const response = await fetch(`${API_URL}/data/batch`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ids),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al eliminar los datos en lote");
  }

  return response.json();
};