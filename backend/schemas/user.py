from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    email: str
    role: Optional[str] = "client"
    name: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[str]
    name: Optional[str]
    phone: Optional[str]
    role: Optional[str]

class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True
