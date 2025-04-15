from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from sqlalchemy.future import select
from sqlalchemy import delete
from sqlalchemy.orm import selectinload
from sqlalchemy import Table, Column, ForeignKey, MetaData
from sqlalchemy.dialects.postgresql import UUID
from fastapi import HTTPException
from backend.models import ClassModel, Connection, Attribute, Data, Property
from backend.schemas import (
    ClassModelCreate, ConnectionCreate, ClassUpdate, AttributeCreate, AttributeUpdate,
    DataCreate, DataUpdate, PropertyCreate, PropertyUpdate
)
import uuid

# ✅ CRUD para ClassModel

async def create_class(db: AsyncSession, class_data: ClassModelCreate):
    """ Crea una nueva clase """
    new_class = ClassModel(name=class_data.name)
    db.add(new_class)
    await db.commit()
    await db.refresh(new_class)
    return new_class

async def get_classes(db: AsyncSession):
    """ Obtiene todas las clases con sus atributos y datos """
    result = await db.execute(
        select(ClassModel)
        .options(selectinload(ClassModel.attributes), selectinload(ClassModel.data_entries))
    )
    return result.scalars().all()

async def get_class_by_id(db: AsyncSession, class_id: str):
    """ Obtiene una clase por su ID """
    result = await db.execute(select(ClassModel).where(ClassModel.id == class_id))
    return result.scalars().first()

async def update_class(db: AsyncSession, class_id: str, update_data: ClassUpdate):
    db_class = await db.get(ClassModel, class_id)
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    
    # Solo actualizar los campos que se envían
    update_dict = update_data.dict(exclude_unset=True)  # Excluir campos no enviados
    for key, value in update_dict.items():
        setattr(db_class, key, value)
    
    await db.commit()
    await db.refresh(db_class)
    return db_class

async def delete_class(db: AsyncSession, class_id: str):
    """ Elimina una clase y sus dependencias automáticamente con CASCADE """
    try:
        result = await db.execute(select(ClassModel).where(ClassModel.id == class_id))
        class_instance = result.scalars().first()
        if not class_instance:
            raise HTTPException(status_code=404, detail="Clase no encontrada")
        
        await db.delete(class_instance)
        await db.commit()
        return {"message": "Clase eliminada correctamente"}

    except Exception as e:
        await db.rollback()
        return {"error": str(e)}

# ✅ CRUD para Attribute

async def get_attributes_by_class(db: AsyncSession, class_id: str):
    """ Obtiene los atributos de una clase """
    result = await db.execute(select(Attribute).where(Attribute.class_id == class_id))
    return result.scalars().all()

async def create_attribute(db: AsyncSession, attr_data: AttributeCreate):
    """ Crea un nuevo atributo """
    new_attr = Attribute(
        class_id=attr_data.class_id,  # Correcto
        name=attr_data.name,
        data_type=attr_data.data_type
    )
    db.add(new_attr)
    await db.commit()
    await db.refresh(new_attr)
    return new_attr

async def update_attribute(db: AsyncSession, attribute_id: str, update_data: AttributeUpdate):
    """ Actualiza un atributo """
    result = await db.execute(select(Attribute).where(Attribute.id == attribute_id))
    attr_instance = result.scalars().first()
    if not attr_instance:
        raise HTTPException(status_code=404, detail="Atributo no encontrado")
    if update_data.name:
        attr_instance.name = update_data.name
    if update_data.data_type:
        attr_instance.data_type = update_data.data_type
    await db.commit()
    await db.refresh(attr_instance)
    return attr_instance

async def delete_attribute(db: AsyncSession, attribute_id: str):
    """ Elimina un atributo y sus propiedades """
    try:
        result = await db.execute(select(Attribute).where(Attribute.id == attribute_id))
        attr_instance = result.scalars().first()
        if not attr_instance:
            raise HTTPException(status_code=404, detail="Atributo no encontrado")
        await db.delete(attr_instance)
        await db.commit()
        return attr_instance
    except Exception as e:
        await db.rollback()
        return {"error": str(e)}

# ✅ CRUD para Data

async def create_data(db: AsyncSession, data: DataCreate):
    """ Crea una nueva entrada de datos """
    new_data = Data(class_id=data.class_id, content=data.content)
    db.add(new_data)
    await db.commit()
    await db.refresh(new_data)
    return new_data

async def update_data(db: AsyncSession, data_id: str, update_data: DataUpdate):
    """ Actualiza una entrada de datos """
    result = await db.execute(select(Data).where(Data.id == data_id))
    data_instance = result.scalars().first()
    if not data_instance:
        raise HTTPException(status_code=404, detail="Entrada de datos no encontrada")
    if update_data.content:
        data_instance.content = update_data.content
    await db.commit()
    await db.refresh(data_instance)
    return data_instance

async def get_data_by_class(db: AsyncSession, class_id: str):
    """ Obtiene datos relacionados a una clase """
    result = await db.execute(select(Data).where(Data.class_id == class_id))
    return result.scalars().all()

async def delete_data(db: AsyncSession, data_id: str):
    """ Elimina una entrada de datos """
    result = await db.execute(select(Data).where(Data.id == data_id))
    data_instance = result.scalars().first()
    if not data_instance:
        raise HTTPException(status_code=404, detail="Entrada de datos no encontrada")
    await db.delete(data_instance)
    await db.commit()
    return data_instance

# ✅ CRUD para Property

async def create_property(db: AsyncSession, property_data: PropertyCreate):
    """ Crea una nueva propiedad """
    new_property = Property(
        name=property_data.name,
        value=property_data.value,
        attribute_id=property_data.attribute_id
    )
    db.add(new_property)
    await db.commit()
    await db.refresh(new_property)
    return new_property

async def update_property(db: AsyncSession, property_id: str, update_data: PropertyUpdate):
    """ Actualiza una propiedad """
    result = await db.execute(select(Property).where(Property.id == property_id))
    property_instance = result.scalars().first()
    if not property_instance:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    if update_data.name:
        property_instance.name = update_data.name
    if update_data.value:
        property_instance.value = update_data.value
    await db.commit()
    await db.refresh(property_instance)
    return property_instance

async def get_properties_by_attribute(db: AsyncSession, attribute_id: str):
    """ Obtiene las propiedades de un atributo """
    result = await db.execute(select(Property).where(Property.attribute_id == attribute_id))
    return result.scalars().all()

async def delete_property(db: AsyncSession, property_id: str):
    """ Elimina una propiedad """
    result = await db.execute(select(Property).where(Property.id == property_id))
    property_instance = result.scalars().first()
    if not property_instance:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    await db.delete(property_instance)
    await db.commit()
    return property_instance


# ✅ CRUD para Connetion

async def get_connections(db: AsyncSession):
    result = await db.execute(text("SELECT * FROM connections"))
    return result.fetchall()

async def get_class(db: AsyncSession, class_id: str):
    return await db.get(ClassModel, class_id)

async def create_connection(db: AsyncSession, connection_data: ConnectionCreate):
    db_connection = Connection(**connection_data.dict())
    db.add(db_connection)
    await db.commit()
    await db.refresh(db_connection)
    return db_connection

async def delete_connection(db: AsyncSession, connection_id: str):
    db_connection = await db.get(Connection, connection_id)
    if not db_connection:
        return {"error": "Connection not found"}
    await db.delete(db_connection)
    await db.commit()
    return {"message": "Connection deleted"}

    # Ejecutar la consulta en el contexto asíncrono
    await db.execute(text(create_table_query))
    await db.commit()
    return table_name

async def create_data_batch(db: AsyncSession, data_list: list[DataCreate]):
    """ Crea múltiples entradas de datos en una sola operación """
    # Preparar los datos para la inserción masiva
    mappings = [
        {
            "id": str(uuid.uuid4()),
            "class_id": str(data.class_id),
            "content": data.content
        }
        for data in data_list
    ]
    print(len(mappings))
    try:
        # Usar bulk_insert_mappings para insertar todos los registros de una vez
        await db.execute(
            Data.__table__.insert(),
            mappings
        )
        await db.commit()
        return len(mappings)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear datos: {str(e)}")