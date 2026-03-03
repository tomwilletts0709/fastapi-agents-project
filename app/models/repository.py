import os
from typing import AsyncGenerator

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class Repository:
    def __init__(self):
        self.session = SessionLocal()

    def get_by_id(self, model: Base, id: int) -> AsyncGenerator[Base, None]:
        session = self.session()
        try:
            result = session.execute(select(model).where(model.id == id))
            return result.scalar_one_or_none()
        except Exception as e:
            raise e
        finally:
            session.close() 

    def create(self, model: Base) -> AsyncGenerator[Base, None]:
        session = self.session()
        try:
            session.add(model)
            session.commit()
            return model
        except Exception as e:
            raise e
        finally:
            session.close()
        
    
    def delete(self, model: Base) -> AsyncGenerator[Base, None]:
        session = self.session()
        try:
            session.delete(model)
            session.commit()
            return model
        except Exception as e:
            raise e
        finally:
            session.close()