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


MIN_LAT, MAX_LAT = -33.87281148961029, -33.86727190845753  # Latitude range for Sydney
MIN_LON, MAX_LON = 151.20713716726718, 151.21391050391784  # Longitude range for Sydney

def generate_random_datetime():
    """Generate a starting datetime within the last 30 days."""
    start_date = datetime.now() - timedelta(days=30)
    return start_date

def insert_sample_data():
    with Session() as session:
        ir = []

        # Generate 100 unique sensor locations
        sensors = [
            {
                "latitude": round(random.uniform(MIN_LAT, MAX_LAT), 6),
                "longitude": round(random.uniform(MIN_LON, MAX_LON), 6),
                "count": random.randint(0, 250)  # Initial pedestrian count (0-250)
            }
            for _ in range(100)
        ]

        for sensor in sensors:
            current_datetime = generate_random_datetime()
            current_count = sensor["count"]

            for _ in range(1000):  # 1000 readings per sensor
                # Random interval between 5 and 20 minutes
                interval = random.randint(5, 20)
                current_datetime += timedelta(minutes=interval)

                # Adjust count, ensuring it only changes by ±20
                change = random.randint(-20, 20)
                new_count = max(0, current_count + change)  # Ensure count never goes below 0
                current_count = new_count  # Update count for next iteration

                # Add to list
                ir.append(Infrared(
                    latitude=sensor["latitude"],
                    longitude=sensor["longitude"],
                    count=current_count,
                    recorded_datetime=current_datetime
                ))

        # Bulk insert all records
        session.add_all(ir)
        session.commit()
        print("Sample data inserted into all tables!")



if __name__ == "__main__":
    reset_database()
    setup_database()  # Create the database and tables
    insert_sample_data()  # Insert initial data if necessary