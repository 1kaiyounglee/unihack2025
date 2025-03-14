from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from models import Base

from sqlalchemy.types import TypeDecorator
from datetime import datetime

class DateFormat(TypeDecorator):
    impl = Date

    def process_bind_param(self, value, dialect):
        if value is not None:
            # check if value is a datetime object
            if isinstance(value, datetime):
                # if it is, use the date part (this returns just the date without time)
                return value.date()
            else:
                # if its not a datetime object, assume string and parse it
                return datetime.strptime(value, '%d/%m/%Y').date()
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            # return the date in dd/mm/yyyy format for display
            return value.strftime('%d/%m/%Y')
        return value

    

class Infared(Base):
    __tablename__ = 'Infared'
    
    id                        = Column(Integer, primary_key=True, autoincrement=True)
    count                     = Column(Integer, nullable=False)
    date_recorded             = Column(DateFormat, nullable=False)
    
    # Relationships
    # user                    = relationship('Users', back_populates='bookings')
    # package                 = relationship('Packages', back_populates='bookings')
    # order_items             = relationship('OrderItems', back_populates='booking')