@echo off
start cmd /k "cd frontend && npm run dev"
start cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"