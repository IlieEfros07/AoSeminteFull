from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.partner import PartnerCreate, PartnerUpdate
from app.database import get_db
import crud.partners as crud

router = APIRouter()

@router.post("/partners")
def create(data: PartnerCreate, db: Session = Depends(get_db)):
    return crud.create_partner(db, data)

@router.get("/partners")
def all(db: Session = Depends(get_db)):
    return crud.get_partners(db)

@router.put("/partners/{id}")
def update(id: int, data: PartnerUpdate, db: Session = Depends(get_db)):
    return crud.update_partner(db, id, data)

@router.delete("/partners/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    if crud.delete_partner(db, id):
        return {"message": "Deleted"}
    raise HTTPException(404, "Partner not found")
