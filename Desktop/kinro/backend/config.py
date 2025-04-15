import os
from dotenv import load_dotenv
import toml

# Cargar variables de entorno desde .env
load_dotenv()

# Cargar configuraciones desde pyproject.toml
config = toml.load("pyproject.toml")

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = os.getenv("DEBUG") == "True"
PROJECT_NAME = config["tool"]["poetry"]["name"]
VERSION = config["tool"]["poetry"]["version"]

print(f"Proyecto: {PROJECT_NAME} v{VERSION}")
print(f"Base de Datos: {DATABASE_URL}")
print(f"Modo Debug: {DEBUG}")
