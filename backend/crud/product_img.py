from sqlalchemy.orm import Session
from models.product_image import ProductImage
from schemas.product_image import ProductImageCreate, ProductImageUpdate
from fastapi import APIRouter


router = APIRouter()

def get_productImg(db: Session, product_id: int) -> str:
    db_product = db.query(ProductImage).filter(ProductImage.product_id == product_id).first()
    if db_product:
        return db_product.image_url
    return None

def post_productImg(db: Session, product_id: int, image_url: str) -> str:
    db_product = db.query(ProductImage).filter(ProductImage.product_id == product_id).first()
    if db_product:
        db_product.image_url = image_url
        db.commit()
        return db_product.image_url
    return None