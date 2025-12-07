from sqlalchemy.orm import Session
from models.pages import Page
from schemas import PageCreate, PageUpdate

def create_page(db: Session, data: PageCreate):
    page = Page(**data.dict())
    db.add(page)
    db.commit()
    db.refresh(page)
    return page

def get_pages(db: Session):
    return db.query(Page).all()

def get_page(db: Session, page_id: int):
    return db.query(Page).filter(Page.id == page_id).first()

def update_page(db: Session, page_id: int, data: PageUpdate):
    page = get_page(db, page_id)
    if not page:
        return None

    for key, val in data.dict(exclude_unset=True).items():
        setattr(page, key, val)

    db.commit()
    db.refresh(page)
    return page

def delete_page(db: Session, page_id: int):
    page = get_page(db, page_id)
    if not page:
        return False

    db.delete(page)
    db.commit()
    return True
