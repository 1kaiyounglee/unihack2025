from sqlalchemy import Column, Integer, DECIMAL, DateTime, String, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from models import Base

class Alerts(Base):
    __tablename__ = 'Alerts'
    
    id                          = Column(Integer, primary_key=True, autoincrement=True)
    latitude                    = Column(DECIMAL(9,6), nullable=False)
    longitude                   = Column(DECIMAL(9,6), nullable=False)
    radius                      = Column(Integer, nullable=False)
    threshold                   = Column(Integer, nullable=False)
    

    
    