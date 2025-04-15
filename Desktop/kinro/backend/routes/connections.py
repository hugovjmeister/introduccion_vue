# backend/routes/connections.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend import crud
from backend.schemas import ConnectionSchema, ConnectionCreate

router = APIRouter(prefix="/connections", tags=["Connections"])

@router.get("/", response_model=list[ConnectionSchema])
async def get_connections(db: AsyncSession = Depends(get_db)):
    return await crud.get_connections(db)

@router.post("/", response_model=ConnectionSchema)
async def create_connection(connection_data: ConnectionCreate, db: AsyncSession = Depends(get_db)):
    source_exists = await crud.get_class(db, connection_data.source_class)
    target_exists = await crud.get_class(db, connection_data.target_class)
    if not source_exists or not target_exists:
        raise HTTPException(status_code=404, detail="Clase origen o destino no encontrada")
    return await crud.create_connection(db, connection_data)

@router.delete("/{connection_id}", response_model=dict)
async def delete_connection(connection_id: str, db: AsyncSession = Depends(get_db)):
    result = await crud.delete_connection(db, connection_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result