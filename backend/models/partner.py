from sqlalchemy import Column, Integer, String
from app.database import Base

class Partner(Base):
    __tablename__ = "partners"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    logo_url = Column(String)
    link = Column(String)
    sort_order = Column(Integer, default=0)
