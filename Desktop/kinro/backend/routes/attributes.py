# backend/routes/attributes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend import crud
from backend.schemas import AttributeCreate, AttributeSchema, AttributeUpdate

router = APIRouter(prefix="/attributes", tags=["Attributes"])

@router.get("/{class_id}/attributes/", response_model=list[AttributeSchema])
async def get_attributes_by_class(class_id: str, db: AsyncSession = Depends(get_db)):
    return await crud.get_attributes_by_class(db, class_id)

@router.post("/", response_model=AttributeSchema)
async def create_attribute(attribute_data: AttributeCreate, db: AsyncSession = Depends(get_db)):
    # Verificar que la clase existe
    class_exists = await crud.get_class(db, attribute_data.class_id)  # Ajustado a class_id
    if not class_exists:
        raise HTTPException(status_code=404, detail="Clase no encontrada")
    return await crud.create_attribute(db, attribute_data)

@router.patch("/{attribute_id}", response_model=AttributeSchema)
async def update_attribute(attribute_id: str, update_data: AttributeUpdate, db: AsyncSession = Depends(get_db)):
    updated_attr = await crud.update_attribute(db, attribute_id, update_data)
    if not updated_attr:
        raise HTTPException(status_code=404, detail="Atributo no encontrado")
    return updated_attr

@router.delete("/{attribute_id}", response_model=AttributeSchema)
async def delete_attribute(attribute_id: str, db: AsyncSession = Depends(get_db)):
    deleted_attr = await crud.delete_attribute(db, attribute_id)
    if not deleted_attr:
        raise HTTPException(status_code=404, detail="Atributo no encontrado")
    return deleted_attr