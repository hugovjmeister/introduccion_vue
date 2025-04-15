from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend import crud
from backend.schemas import ClassModelSchema, ClassModelCreate, ClassUpdate

router = APIRouter(prefix="/classes", tags=["Classes"])

@router.get("/", response_model=list[ClassModelSchema])
async def get_classes(db: AsyncSession = Depends(get_db)):
    return await crud.get_classes(db)

@router.post("/", response_model=ClassModelSchema)
async def create_class(class_data: ClassModelCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_class(db, class_data)

@router.patch("/{class_id}", response_model=ClassModelSchema)
async def update_class(class_id: str, update_data: ClassUpdate, db: AsyncSession = Depends(get_db)):
    try:
        updated_class = await crud.update_class(db, class_id, update_data)
        if not updated_class:
            raise HTTPException(status_code=404, detail="Clase no encontrada")
        return updated_class
    except Exception as e:
        # Capturar y mostrar el error exacto en los logs
        print(f"Error updating class {class_id}: {str(e)}")
        raise HTTPException(status_code=422, detail=f"Error al procesar la actualización: {str(e)}")

@router.delete("/{class_id}", response_model=dict)
async def delete_class(class_id: str, db: AsyncSession = Depends(get_db)):
    result = await crud.delete_class(db, class_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result