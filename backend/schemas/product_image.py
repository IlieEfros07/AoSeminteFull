from pydantic import BaseModel
from typing import Optional

class ProductImageBase(BaseModel):
    url: str
    is_main: Optional[bool] = False
    product_id: int

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageUpdate(BaseModel):
    url: Optional[str]
    is_main: Optional[bool]

class ProductImageOut(BaseModel):
    id: int
    url: str
    is_main: bool

    class Config:
        from_attributes = True
