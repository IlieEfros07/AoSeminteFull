from pydantic import BaseModel
from typing import Optional, List
from schemas.product_image import ProductImageOut
from schemas.category import CategoryOut

class ProductBase(BaseModel):
    name: str
    slug: str
    price: float
    stock: int
    description: Optional[str] = None
    category_id: Optional[int] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str]
    slug: Optional[str]
    price: Optional[float]
    stock: Optional[int]
    description: Optional[str]
    category_id: Optional[int]
    is_active: Optional[bool]

class ProductOut(BaseModel):
    id: int
    name: str
    price: float
    stock: int
    description: str | None = None
    category_id: int | None = None
    is_new: bool | None = None

    class Config:
        from_attributes = True 

class ProductList(BaseModel):
    products: List[ProductOut]
    total: int
    skip: int
    limit: int
