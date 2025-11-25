from pydantic import BaseModel
from typing import Optional, Dict, Any

class ConfigPublicBase(BaseModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    working_hours: Optional[str] = None
    social: Optional[Dict[str, Any]] = None

class ConfigPublicUpdate(ConfigPublicBase):
    pass

class ConfigPublicOut(ConfigPublicBase):
    id: int

    class Config:
        from_attributes = True
