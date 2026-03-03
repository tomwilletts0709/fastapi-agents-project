import os
from typing import AsyncGenerator

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class Repository:
    def __init__(self):
        self.engine = create_engine(os.getenv("DATABASE_URL"))
        self.session = sessionmaker(bind=self.engine)

    def get_by_id(self, model: Base, id: int) -> AsyncGenerator[Base, None]:
        return self.session.query(model).filter(model.id == id).first()
    
    def create(self, model: Base) -> AsyncGenerator[Base, None]:
        self.session.add(model)
        self.session.commit()
        return model
    
    def update(self, model: Base) -> AsyncGenerator[Base, None]:
        self.session.commit()
        return model
    
    def delete(self, model: Base) -> AsyncGenerator[Base, None]:
        self.session.delete(model)
        self.session.commit()
        return model