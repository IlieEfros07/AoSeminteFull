from sqlalchemy.orm import Session
from models import category
from schemas import CategoryCreate, CategoryUpdate

def create_category(db: Session, category_data: CategoryCreate) -> category.Category:
    db_category = category.Category(**category_data.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(category.Category).offset(skip).limit(limit).all()

def get_category(db: Session, category_id: int) -> category.Category:
    return db.query(category.Category).filter(category.Category.id == category_id).first()

def update_category(db: Session, category_id: int, category_update: CategoryUpdate) -> category.Category:
    db_category = db.query(category.Category).filter(category.Category.id == category_id).first()
    if db_category:
        for key, value in category_update.dict(exclude_unset=True).items():
            setattr(db_category, key, value)
        db.commit()
        db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int) -> bool:
    db_category = db.query(category.Category).filter(category.Category.id == category_id).first()
    if db_category:
        db.delete(db_category)
        db.commit()
        return True
    return False

