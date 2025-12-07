from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
import crud.users as crud

router = APIRouter()

@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    email = data["email"]
    password = data["password"]

    user = crud.get_user_by_email(db, email)

    if not user:
        raise HTTPException(400, "User not found")

    if not crud.verify_password(password, user.password_hash):
        raise HTTPException(400, "Wrong password")

    return {"message": "Logged in", "user_id": user.id}
