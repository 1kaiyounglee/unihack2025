from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Infrared
from db_config import engine, Session
from datetime import datetime, timedelta
import random


def reset_database():
    from models import Base  # Ensure that the Base is imported from the correct location
    Base.metadata.drop_all(engine)  # Drop all tables if they exist
    print("Database wiped!")


def setup_database():
    from models import Base  # Ensure that the Base is imported from the correct location
    Base.metadata.create_all(engine)  # This creates all tables defined
    print("Database and tables created!")


MIN_LAT, MAX_LAT = -34.1183, -33.5781  # Latitude range for Sydney
MIN_LON, MAX_LON = 150.5209, 151.3430  # Longitude range for Sydney

def generate_random_datetime():
    """Generate a random datetime within the last 30 days."""
    start_date = datetime.now() - timedelta(days=30)
    random_days = random.randint(0, 30)
    random_time = start_date + timedelta(days=random_days, hours=random.randint(0, 23), minutes=random.randint(0, 59), seconds=random.randint(0, 59))
    return random_time.strftime('%d/%m/%Y %H:%M:%S')  # Match your database format

# Insert Sample Data
def insert_sample_data():
    with Session() as session:
        ir = [
            Infrared(
                latitude=round(random.uniform(MIN_LAT, MAX_LAT), 6),
                longitude=round(random.uniform(MIN_LON, MAX_LON), 6),
                count=random.randint(0, 250),  # Random pedestrian count (0-50)
                recorded_datetime=datetime.strptime(generate_random_datetime(), '%d/%m/%Y %H:%M:%S')
            )
            for _ in range(200)
        ]
        
        session.add_all(ir)

        session.commit()
        print("Sample data inserted into all tables!")



if __name__ == "__main__":
    reset_database()
    setup_database()  # Create the database and tables
    insert_sample_data()  # Insert initial data if necessary