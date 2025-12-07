from pydantic import BaseModel
from typing import Optional, Any, Dict

class PageBase(BaseModel):
    slug: str
    title: Optional[str] = None
    content: Optional[Dict[str, Any]] = None  # JSON

class PageCreate(PageBase):
    pass

class PageUpdate(PageBase):
    pass

class PageOut(PageBase):
    id: int

    class Config:
        from_attributes = True
