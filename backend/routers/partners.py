from sqlalchemy.orm import Session
from models.partner import Partner
from schemas import PartnerCreate, PartnerUpdate

def create_partner(db: Session, data: PartnerCreate):
    partner = Partner(**data.dict())
    db.add(partner)
    db.commit()
    db.refresh(partner)
    return partner

def get_partners(db: Session):
    return db.query(Partner).all()

def get_partner(db: Session, partner_id: int):
    return db.query(Partner).filter(Partner.id == partner_id).first()

def update_partner(db: Session, partner_id: int, data: PartnerUpdate):
    partner = get_partner(db, partner_id)
    if not partner:
        return None

    for key, val in data.dict(exclude_unset=True).items():
        setattr(partner, key, val)

    db.commit()
    db.refresh(partner)
    return partner

def delete_partner(db: Session, partner_id: int):
    partner = get_partner(db, partner_id)
    if not partner:
        return False

    db.delete(partner)
    db.commit()
    return True
