from sqlalchemy import Column, Integer, DECIMAL, DateTime, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from models import Base

class Infrared(Base):
    __tablename__ = 'Infrared'
    
    id                          = Column(Integer, primary_key=True, autoincrement=True)
    longitude                   = Column(DECIMAL(9,6), nullable=False)
    latitude                    = Column(DECIMAL(9,6), nullable=False)
    count                       = Column(Integer, nullable=False)
    recorded_datetime           = Column(DateTime, nullable=False)
    
    # Relationships
    # user                    = relationship('Users', back_populates='bookings')
    # package                 = relationship('Packages', back_populates='bookings')
    # order_items             = relationship('OrderItems', back_populates='booking')