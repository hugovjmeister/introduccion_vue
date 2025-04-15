from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend import crud
from backend.schemas import PropertyCreate, PropertySchema, PropertyUpdate

router = APIRouter(prefix="/properties", tags=["Properties"])

@router.get("/{attribute_id}/properties/", response_model=list[PropertySchema])
async def get_properties_by_attribute(attribute_id: str, db: AsyncSession = Depends(get_db)):
    return await crud.get_properties_by_attribute(db, attribute_id)

@router.post("/", response_model=PropertySchema)
async def create_property(property_data: PropertyCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_property(db, property_data)

@router.patch("/{property_id}", response_model=PropertySchema)
async def update_property(property_id: str, update_data: PropertyUpdate, db: AsyncSession = Depends(get_db)):
    updated_property = await crud.update_property(db, property_id, update_data)
    if not updated_property:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    return updated_property

@router.delete("/{property_id}", response_model=PropertySchema)
async def delete_property(property_id: str, db: AsyncSession = Depends(get_db)):
    deleted_property = await crud.delete_property(db, property_id)
    if not deleted_property:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    return deleted_property
