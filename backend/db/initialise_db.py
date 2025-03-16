from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Infrared, Event, Alerts
from db_config import engine, Session
from datetime import datetime, timedelta
import random


def reset_database():
    from models import Base  
    Base.metadata.drop_all(engine)  
    print("Database wiped!")


def setup_database():
    from models import Base  
    Base.metadata.create_all(engine)  
    print("Database and tables created!")


MIN_LAT, MAX_LAT = -33.87281148961029, -33.86727190845753  # lat range for Sydney
MIN_LON, MAX_LON = 151.20713716726718, 151.21391050391784  # long range for Sydney

def generate_random_datetime():
    """Generate a starting datetime within the last 30 days."""
    start_date = datetime.now() - timedelta(days=30)
    return start_date

def insert_sample_data():
    with Session() as session:

        alerts = [
            Alerts(latitude=-33.870042, longitude=151.210524, radius=100, threshold=200),
            Alerts(latitude=-33.704123, longitude=151.161057, radius=600, threshold=10)
        ]

        events = [ 
            Event(latitude=-33.704123, longitude=151.161057, name="Party at Kyan Jia Ren Gans house", description="31 Awatea Rd, St Ives Chase, New South Wales -33.704123 151.161057", start_datetime=datetime.now(), duration=1200),
            Event(latitude=-33.870042, longitude=151.210524, name="food", description="mmmmm", start_datetime=datetime.now(), duration=800)
        ]

        ir = []

        # gen 100 sensor locs
        sensors = [
            {
                "latitude": round(random.uniform(MIN_LAT, MAX_LAT), 6),
                "longitude": round(random.uniform(MIN_LON, MAX_LON), 6),
                "count": random.randint(0, 250) 
            }
            for _ in range(100)
        ]

        for sensor in sensors:
            current_datetime = generate_random_datetime()
            current_count = sensor["count"]

            for _ in range(1000):  # 1000 readings per sensor
               
                interval = random.randint(5, 20)
                current_datetime += timedelta(minutes=interval)

                
                change = random.randint(-20, 20)
                new_count = max(0, current_count + change)  
                current_count = new_count  

                ir.append(Infrared(
                    latitude=sensor["latitude"],
                    longitude=sensor["longitude"],
                    count=current_count,
                    recorded_datetime=current_datetime
                ))
        
        #  insert all records
        session.add_all(events)
        session.add_all(alerts)
        session.add_all(ir)
        session.commit()
        print("Sample data inserted into all tables!")



if __name__ == "__main__":
    reset_database()
    setup_database()  
    insert_sample_data()  