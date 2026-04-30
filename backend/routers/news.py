from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
import crud.news as crud
from schemas.news import NewsCreate, NewsUpdate

router = APIRouter()

from sqlalchemy.exc import IntegrityError

@router.post("/news")
def create(news: NewsCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_news(db, news)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="A news article with this slug already exists.")

@router.get("/news")
def all_news(db: Session = Depends(get_db)):
    return crud.get_news_list(db)

@router.get("/news/{id}")
def get(id: int, db: Session = Depends(get_db)):
    post = crud.get_news(db, id)
    if not post:
        raise HTTPException(404, "News not found")
    return post

@router.put("/news/{id}")
def update(id: int, data: NewsUpdate, db: Session = Depends(get_db)):
    try:
        return crud.update_news(db, id, data)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="A news article with this slug already exists.")

@router.delete("/news/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    if crud.delete_news(db, id):
        return {"message": "Deleted"}
    raise HTTPException(404, "News not found")
