from sqlalchemy.orm import Session
from models.news import News
from schemas.news import NewsCreate, NewsUpdate
from fastapi import APIRouter

router = APIRouter()

def create_news(db: Session, data: NewsCreate):
    item = News(**data.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

def get_news_list(db: Session, skip=0, limit=100):
    return db.query(News).order_by(News.id.desc()).offset(skip).limit(limit).all()

def get_news(db: Session, news_id: int):
    return db.query(News).filter(News.id == news_id).first()

def update_news(db: Session, news_id: int, data: NewsUpdate):
    item = get_news(db, news_id)
    if not item:
        return None

    for key, val in data.dict(exclude_unset=True).items():
        setattr(item, key, val)

    db.commit()
    db.refresh(item)
    return item

def delete_news(db: Session, news_id: int):
    item = get_news(db, news_id)
    if not item:
        return False

    db.delete(item)
    db.commit()
    return True
