import sys
import os

# 🔹 Agregar la raíz del proyecto al `sys.path`
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.models import Base
from backend.database import DATABASE_URL
from sqlalchemy.ext.asyncio import create_async_engine
import asyncio

async def create_tables():
    engine = create_async_engine(DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        print("🔹 Creando tablas manualmente...")
        await conn.run_sync(Base.metadata.create_all)
        print("✅ ¡Tablas creadas con éxito!")

if __name__ == "__main__":
    asyncio.run(create_tables())
