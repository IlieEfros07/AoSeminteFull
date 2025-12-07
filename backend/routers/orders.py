from sqlalchemy.orm import Session
from models.order import Order
from models.order_item import OrderItem
from models.product import Product
from schemas.order import OrderCreate, OrderUpdate

def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(Order)
        .order_by(Order.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_order(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()


def create_order(db: Session, order_data: OrderCreate) -> Order:
    

    db_order = Order(
        customer_name=order_data.customer_name,
        customer_phone=order_data.customer_phone,
        customer_email=order_data.customer_email,
        customer_address=order_data.customer_address,
        payment_status="pending",
        order_status="pending",
        user_id=order_data.user_id
    )
    db.add(db_order)
    db.flush() 

    total = 0

    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()

        if not product:
            raise Exception(f"Product {item.product_id} does not exist")

        if product.stock < item.quantity:
            raise Exception(f"Not enough stock for {product.name}")

        order_item = OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=product.price, 
        )
        db.add(order_item)
        total += product.price * item.quantity

        product.stock -= item.quantity

    db_order.total = total

    db.commit()
    db.refresh(db_order)

    return db_order



def update_order(db: Session, order_id: int, order_update: OrderUpdate):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        return None

    data = order_update.dict(exclude_unset=True)
    for key, value in data.items():
        setattr(order, key, value)

    db.commit()
    db.refresh(order)
    return order

def delete_order(db: Session, order_id: int):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return False
    
    db.delete(order)
    db.commit()
    return True

