from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.pages import PageCreate, PageUpdate
from app.database import get_db
import crud.pages as crud

router = APIRouter()

@router.post("/pages")
def create(data: PageCreate, db: Session = Depends(get_db)):
    return crud.create_page(db, data)

@router.get("/pages")
def all(db: Session = Depends(get_db)):
    return crud.get_pages(db)

@router.get("/pages/{slug}")
def get(slug: str, db: Session = Depends(get_db)):
    page = crud.get_page_by_slug(db, slug)
    if not page:
        raise HTTPException(404, "Page not found")
    return page

@router.put("/pages/{id}")
def update(id: int, data: PageUpdate, db: Session = Depends(get_db)):
    return crud.update_page(db, id, data)

@router.delete("/pages/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    if crud.delete_page(db, id):
        return {"message": "Deleted"}
    raise HTTPException(404, "Page not found")
