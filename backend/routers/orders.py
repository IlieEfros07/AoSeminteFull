from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
import crud.orders as crud

from schemas.order import (
    OrderCreate,
    OrderUpdate,
)

router = APIRouter()


@router.post("/orders")
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    try:
        new_order = crud.create_order(db, order)
        return new_order
    except Exception as e:
        raise HTTPException(400, str(e))



@router.get("/orders")
def get_all_orders(db: Session = Depends(get_db)):
    return crud.get_orders(db)



@router.get("/orders/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = crud.get_order(db, order_id)
    if not order:
        raise HTTPException(404, "Order not found")
    return order



@router.put("/orders/{order_id}")
def update_order(order_id: int, data: OrderUpdate, db: Session = Depends(get_db)):
    updated = crud.update_order(db, order_id, data)
    if not updated:
        raise HTTPException(404, "Order not found")
    return updated



@router.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_order(db, order_id)
    if not ok:
        raise HTTPException(404, "Order not found")
    return {"message": "Order deleted"}
