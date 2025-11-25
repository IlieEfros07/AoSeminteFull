from sqlalchemy import Column, Integer, String, TIMESTAMP, text
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="client")
    name = Column(String)
    phone = Column(String)

    created_at = Column(TIMESTAMP, server_default=text("NOW()"))
