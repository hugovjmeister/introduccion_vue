# ✅ backend/routes/data.py
import logging
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from backend.database import get_db
from backend import crud
from backend.schemas import DataCreate, DataSchema, DataUpdate
from typing import List
from backend.models import Data

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/data", tags=["Data"])

@router.get("/{class_id}/data/", response_model=list[DataSchema])
async def get_data_by_class(class_id: str, db: AsyncSession = Depends(get_db)):
    return await crud.get_data_by_class(db, class_id)

@router.post("/", response_model=DataSchema)
async def create_data(data: DataCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_data(db, data)

@router.post("/batch", response_model=dict)
async def create_data_batch(data_list: List[DataCreate], db: AsyncSession = Depends(get_db)):
    try:
        created_count = await crud.create_data_batch(db, data_list)
        return {"message": f"{created_count} datos creados exitosamente"}
    except Exception as e:
        logger.exception("Error al crear datos en batch")
        raise HTTPException(status_code=500, detail=f"Error al crear datos: {str(e)}")

@router.patch("/{data_id}", response_model=DataSchema)
async def update_data(data_id: str, update_data: DataUpdate, db: AsyncSession = Depends(get_db)):
    updated_data = await crud.update_data(db, data_id, update_data)
    if not updated_data:
        raise HTTPException(status_code=404, detail="Entrada de datos no encontrada")
    return updated_data

@router.delete("/batch", response_model=dict)
async def delete_data_batch(ids: List[str] = Body(...), db: AsyncSession = Depends(get_db)):
    try:
        batch_size = 1000
        total_deleted = 0
        for i in range(0, len(ids), batch_size):
            batch = ids[i:i + batch_size]
            await db.execute(delete(Data).where(Data.id.in_(batch)))
            total_deleted += len(batch)
        await db.commit()
        return {"message": f"{total_deleted} registros eliminados correctamente"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.delete("/{data_id}", response_model=DataSchema)
async def delete_data(data_id: str, db: AsyncSession = Depends(get_db)):
    deleted_data = await crud.delete_data(db, data_id)
    if not deleted_data:
        raise HTTPException(status_code=404, detail="Entrada de datos no encontrada")
    return deleted_data
