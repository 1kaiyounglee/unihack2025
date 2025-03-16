from sqlalchemy import Column, Integer, DECIMAL, DateTime, String, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from models import Base

class Event(Base):
    __tablename__ = 'Event'
    
    id                          = Column(Integer, primary_key=True, autoincrement=True)
    latitude                    = Column(DECIMAL(9,6), nullable=False)
    longitude                   = Column(DECIMAL(9,6), nullable=False)
    name                        = Column(String, nullable=False)
    description                 = Column(String)
    start_datetime              = Column(DateTime, nullable=False)
    duration                    = Column(Integer, nullable=False)
    
    