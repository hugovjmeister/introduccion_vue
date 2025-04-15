@echo off
echo 🔁 Activando entorno virtual...
call .venv\Scripts\activate

echo 🚀 Iniciando backend...
start cmd /k "uvicorn backend.main:app --reload"

echo 🎨 Iniciando frontend...
cd frontend
start cmd /k "npm start"

cd ..
