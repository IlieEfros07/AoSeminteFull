from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, TIMESTAMP, text
from sqlalchemy.orm import relationship
from app.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    user = relationship("User")

    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    customer_email = Column(String)
    customer_address = Column(String, nullable=False)

    payment_status = Column(String, default="pending")
    order_status = Column(String, default="new")

    total = Column(Numeric(10, 2), nullable=False)

    created_at = Column(TIMESTAMP, server_default=text("NOW()"))

    items = relationship("OrderItem", back_populates="order", cascade="all, delete")
