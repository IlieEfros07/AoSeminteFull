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

class ProductOut(ProductBase):
    id: int
    is_active: bool
    category: Optional[CategoryOut] = None
    images: List[ProductImageOut] = []

    class Config:
        from_attributes = True
