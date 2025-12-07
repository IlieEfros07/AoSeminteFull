from passlib.context import CryptContext
from sqlalchemy.orm import Session
from models.user import User
from schemas import UserCreate, UserUpdate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password) 
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()
def get_user(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()
def get_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()
def get_user_by_id(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = hash_password(user.password)
    db_user = User(
        email=user.email,
        password_hash=hashed_password,
        role=user.role,
        name=user.name,
        phone=user.phone
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: UserUpdate) -> User:
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        for key, value in user_update.dict(exclude_unset=True).items():
            if key == "password":
                setattr(db_user, "password_hash", hash_password(value))
            else:
                setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int) -> bool:
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False