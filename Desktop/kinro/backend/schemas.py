from pydantic import BaseModel, field_validator, UUID4
from uuid import UUID
from typing import List, Optional, Dict, Any

# ✅ Esquema para Crear una Clase
class ClassModelCreate(BaseModel):
    name: str

class ClassUpdate(BaseModel):
    name: Optional[str] = None
    position_x: Optional[float] = None
    position_y: Optional[float] = None

# ✅ Esquema para Leer una Clase (Incluye ID y Atributos)
class ClassModelSchema(BaseModel):
    id: UUID
    name: str
    position_x: float
    position_y: float
    attributes: Optional[List["AttributeSchema"]] = []
    data_entries: Optional[List["DataSchema"]] = []

    model_config = {
        "from_attributes": True
    }

# ✅ Esquema para la Creación de Atributos
class AttributeCreate(BaseModel):
    class_id: UUID4
    name: str
    data_type: str

# ✅ Esquema para la Edición de Atributos
class AttributeUpdate(BaseModel):
    name: Optional[str] = None
    data_type: Optional[str] = None

# ✅ Esquema para la Respuesta de Atributos (Incluye ID y Propiedades)
class AttributeSchema(BaseModel):
    id: UUID4
    class_id: UUID4  # Ajustado
    name: str
    data_type: str
    properties: Optional[List["PropertySchema"]] = []

    class Config:
        from_attributes = True

# ✅ Esquema para la Creación de Propiedades
class PropertyCreate(BaseModel):
    attribute_id: UUID
    name: str
    value: str

class PropertyUpdate(BaseModel):
    name: Optional[str] = None
    value: Optional[str] = None

# ✅ Esquema para la Respuesta de Propiedades
class PropertySchema(BaseModel):
    id: UUID
    attribute_id: UUID
    name: str
    value: str

    model_config = {
        "from_attributes": True
    }

# ✅ Esquema para la Creación de Datos
class DataCreate(BaseModel):
    class_id: UUID
    content: Dict[str, Any]  # Se almacena como JSON

class DataUpdate(BaseModel):
    content: Optional[Dict[str, Any]] = None  # ✅ Ajustado para evitar advertencias en Pydantic v2

# ✅ Esquema para la Respuesta de Datos
class DataSchema(BaseModel):
    id: UUID
    class_id: UUID
    content: Dict[str, Any]

    model_config = {
        "from_attributes": True
    }

# ✅ Esquema para Crear una Conexión
class ConnectionCreate(BaseModel):
    source_class: UUID
    target_class: UUID
    relationship_type: str

# ✅ Esquema para Leer una Conexión (Incluye ID)
class ConnectionSchema(ConnectionCreate):
    id: UUID
