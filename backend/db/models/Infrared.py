from sqlalchemy import Column, Integer, DECIMAL, DateTime, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from models import Base

from sqlalchemy.types import TypeDecorator
from datetime import datetime

class Infrared(Base):
    __tablename__ = 'Infrared'
    
    id                          = Column(Integer, primary_key=True, autoincrement=True)
    latitude                    = Column(DECIMAL(9,6), nullable=False)
    longitude                   = Column(DECIMAL(9,6), nullable=False)
    count                       = Column(Integer, nullable=False)
    recorded_datetime           = Column(DateTime, nullable=False)
    

    
    
    