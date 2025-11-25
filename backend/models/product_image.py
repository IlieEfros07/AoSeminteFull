from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True)
    url = Column(String, nullable=False)
    is_main = Column(Boolean, default=False)

    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"))
    product = relationship("Product", back_populates="images")
