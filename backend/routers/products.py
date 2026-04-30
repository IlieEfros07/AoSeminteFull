from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
import crud.products as crud

from schemas.product import ProductCreate, ProductUpdate, ProductList

router = APIRouter()

@router.get("/products",response_model=ProductList)
def list_products(
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    is_new: Optional[bool] = Query(None, description="Filter new products"),
    in_stock: Optional[bool] = Query(None, description="Filter products in stock"),
    sort_by: Optional[str] = Query(None, description="Sort by: price_asc, price_desc, name_asc, name_desc"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    from sqlalchemy import or_, and_
    from models.product import Product
    
    query = db.query(Product)

    if category_id is not None:
        query = query.filter(Product.category_id == category_id)
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term)
            )
        )
    
    if is_new is not None:
        query = query.filter(Product.is_new == is_new)
    
    if in_stock is not None:
        if in_stock:
            query = query.filter(Product.stock > 0)
        else:
            query = query.filter(Product.stock == 0)

    if sort_by == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort_by == "name_asc":
        query = query.order_by(Product.name.asc())
    elif sort_by == "name_desc":
        query = query.order_by(Product.name.desc())
    elif sort_by == "newest":
        query = query.order_by(Product.id.desc())
    
    total = query.count()
    products = query.offset(skip).limit(limit).all()
    
    return {
        "products": products,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/product/image/{id}")
def get_productImg(id: int, db: Session = Depends(get_db)):
    result = crud.get_product(db, id)
    if not result:
        raise HTTPException(404, "Product not found")
    return result.image_url

@router.get("/products/{id}")
def get_product(id: int, db: Session = Depends(get_db)):
    result = crud.get_product(db, id)
    if not result:
        raise HTTPException(404, "Product not found")
    return result

@router.post("/products")
def create(prod: ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, prod)

@router.put("/products/{id}")
def update(id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    return crud.update_product(db, id, data)

@router.delete("/products/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    if crud.delete_product(db, id):
        return {"message": "Deleted"}
    raise HTTPException(404, "Product not found")

