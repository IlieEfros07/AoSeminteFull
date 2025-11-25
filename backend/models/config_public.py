from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from app.database import Base

class ConfigPublic(Base):
    __tablename__ = "config_public"

    id = Column(Integer, primary_key=True)
    phone = Column(String)
    email = Column(String)
    address = Column(String)
    working_hours = Column(String)
    social = Column(JSONB)
