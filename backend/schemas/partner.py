from pydantic import BaseModel
from typing import Optional

class PartnerBase(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    link: Optional[str] = None
    sort_order: int = 0

class PartnerCreate(PartnerBase):
    pass

class PartnerUpdate(BaseModel):
    name: Optional[str]
    logo_url: Optional[str]
    link: Optional[str]
    sort_order: Optional[int]

class PartnerOut(PartnerBase):
    id: int

    class Config:
        from_attributes = True
