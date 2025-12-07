from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
import crud.categories as crud
from schemas.category import CategoryCreate, CategoryUpdate

router = APIRouter()

@router.post("/categories")
def create(category: CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db, category)

@router.get("/categories")
def all(db: Session = Depends(get_db)):
    return crud.get_categories(db)

@router.get("/categories/{id}")
def get(id: int, db: Session = Depends(get_db)):
    cat = crud.get_category(db, id)
    if not cat:
        raise HTTPException(404, "Category not found")
    return cat

@router.put("/categories/{id}")
def update(id: int, data: CategoryUpdate, db: Session = Depends(get_db)):
    return crud.update_category(db, id, data)

@router.delete("/categories/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    if crud.delete_category(db, id):
        return {"message": "Deleted"}
    raise HTTPException(404, "Category not found")
