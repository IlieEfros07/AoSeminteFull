from sqlalchemy.orm import Session
from models.config_public import ConfigPublic
from schemas import ConfigPublicUpdate

def get_config(db: Session) -> ConfigPublic:
    return db.query(ConfigPublic).first()

def update_config(db: Session, data: ConfigPublicUpdate) -> ConfigPublic:
    config = db.query(ConfigPublic).first()

    if not config:
        config = ConfigPublic()
        db.add(config)
        db.flush()

    for key, val in data.dict(exclude_unset=True).items():
        setattr(config, key, val)

    db.commit()
    db.refresh(config)
    return config
