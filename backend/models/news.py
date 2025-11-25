from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, text
from app.database import Base

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    summary = Column(Text)
    content = Column(Text)
    thumbnail = Column(String)

    created_at = Column(TIMESTAMP, server_default=text("NOW()"))
