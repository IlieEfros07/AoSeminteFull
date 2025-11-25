from pydantic import BaseModel
from typing import List, Optional
from app.schemas.order_item import OrderItemOut

class OrderBase(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    customer_address: str
    total: float

    payment_status: Optional[str] = "pending"
    order_status: Optional[str] = "new"

    user_id: Optional[int] = None

class OrderCreate(OrderBase):
    items: List[dict]   # { product_id, quantity }

class OrderUpdate(BaseModel):
    payment_status: Optional[str]
    order_status: Optional[str]

class OrderOut(OrderBase):
    id: int
    items: List[OrderItemOut] = []

    class Config:
        from_attributes = True
