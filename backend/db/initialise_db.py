from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Infared
from db_config import engine, Session
from datetime import datetime, timedelta


def reset_database():
    from models import Base  # Ensure that the Base is imported from the correct location
    Base.metadata.drop_all(engine)  # Drop all tables if they exist
    print("Database wiped!")


def setup_database():
    from models import Base  # Ensure that the Base is imported from the correct location
    Base.metadata.create_all(engine)  # This creates all tables defined
    print("Database and tables created!")

# Insert Sample Data
def insert_sample_data():
    with Session() as session:

        ir = [
            Infared(latitude=-33.7066655, longitude=151.1611542, count=0, date_recorded=datetime.strptime('14/03/2025 12:00:00', '%d/%m/%Y %H:%M:%S'))
            
        
        
        
        
        ]
        

        
        session.add_all(ir)

        session.commit()
        print("Sample data inserted into all tables!")



if __name__ == "__main__":
    reset_database()
    setup_database()  # Create the database and tables
    insert_sample_data()  # Insert initial data if necessary