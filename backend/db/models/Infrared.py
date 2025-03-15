from sqlalchemy import Column, Integer, DECIMAL, DateTime, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from models import Base

from sqlalchemy.types import TypeDecorator
from datetime import datetime

class DateTimeFormat(TypeDecorator):
    impl = DateTime

    def process_bind_param(self, value, dialect):
        if value is not None:
            # check if value is a datetime object
            if isinstance(value, datetime):
                return value
            try:
                return datetime.strptime(value, '%d/%m/%Y %H:%M:%S')
            except ValueError:
                raise ValueError(f"Invalid datetime format: {value}. Expected format: dd/mm/yyyy HH:MM:SS")
        return None

    def process_result_value(self, value, dialect):
        if value is not None:
            # return the date in dd/mm/yyyy format for display
            return value.strftime('%d/%m/%Y %H:%M:%S')
        return None



class Infrared(Base):
    __tablename__ = 'Infrared'
    
    id                        = Column(Integer, primary_key=True, autoincrement=True)
    latitude                  = Column(DECIMAL(9,6), nullable=False)
    longitude                 = Column(DECIMAL(9,6), nullable=False)
    count                     = Column(Integer, nullable=False)
    date_recorded             = Column(DateTimeFormat, nullable=False)
    
    # Relationships
    # user                    = relationship('Users', back_populates='bookings')
    # package                 = relationship('Packages', back_populates='bookings')
    # order_items             = relationship('OrderItems', back_populates='booking')