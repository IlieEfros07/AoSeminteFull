from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.config_public import ConfigPublicUpdate
from app.database import get_db
import crud.config_public as crud

router = APIRouter()

@router.get("/config")
def get_config(db: Session = Depends(get_db)):
    return crud.get_config(db)

@router.put("/config")
def update_config(data: ConfigPublicUpdate, db: Session = Depends(get_db)):
    return crud.update_config(db, data)
