from fastapi import FastAPI
from backend.database import engine
from backend.models import Base
from backend.routes import classes, attributes, data, properties, connections
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

# ✅ Configuración de logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Mi API con FastAPI")

# ✅ Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Evento de inicio
@app.on_event("startup")
async def startup():
    logger.info("🔹 Tablas detectadas por SQLAlchemy:")
    for table in Base.metadata.tables.keys():
        logger.info(f"✅ {table}")

# ✅ Evento de apagado
@app.on_event("shutdown")
async def shutdown():
    """Cierra conexiones a la base de datos si es necesario."""
    await engine.dispose()
    logger.info("🔻 Conexión a la base de datos cerrada.")

# ✅ Incluir rutas organizadas
app.include_router(classes.router)
app.include_router(attributes.router)
app.include_router(data.router)
app.include_router(properties.router)
app.include_router(connections.router)


@app.get("/")
async def root():
    return {"message": "FastAPI funcionando correctamente 🚀"}
