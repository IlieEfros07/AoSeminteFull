from pydantic import BaseModel
from typing import Optional

class NewsBase(BaseModel):
    title: str
    slug: str
    summary: Optional[str] = None
    content: Optional[str] = None
    thumbnail: Optional[str] = None

class NewsCreate(NewsBase):
    pass

class NewsUpdate(BaseModel):
    title: Optional[str]
    slug: Optional[str]
    summary: Optional[str]
    content: Optional[str]
    thumbnail: Optional[str]

class NewsOut(NewsBase):
    id: int

    class Config:
        from_attributes = True
