from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.product_image import ProductImageCreate, ProductImageUpdate
from app.database import get_db
import crud.product_img as crud

router = APIRouter()

from sqlalchemy.exc import IntegrityError

@router.get("/product/image/{id}")
def get_productImg(id: int, db: Session = Depends(get_db)):
    result = crud.get_productImg(db, id)
    if not result:
        raise HTTPException(404, "Product image not found")
    return result

@router.post("/product/image")
def create(data: ProductImageCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_productImg(db, data)
    except IntegrityError:
        raise HTTPException(400, "Product image already exists")
