from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
import crud.products as crud
from schemas.product import ProductCreate, ProductUpdate

router = APIRouter()

@router.post("/products")
def create(prod: ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, prod)

@router.get("/products")
def list_all(db: Session = Depends(get_db)):
    return crud.get_products(db)

@router.get("/products/{id}")
def get(id: int, db: Session = Depends(get_db)):
    result = crud.get_product(db, id)
    if not result:
        raise HTTPException(404, "Product not found")
    return result

@router.put("/products/{id}")
def update(id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    return crud.update_product(db, id, data)

@router.delete("/products/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    if crud.delete_product(db, id):
        return {"message": "Deleted"}
    raise HTTPException(404, "Product not found")
