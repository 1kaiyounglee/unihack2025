from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Infrared
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
            Infrared(longitude=-33.706665, latitude=151.161154, count=67, recorded_datetime=datetime(2025, 3, 14, 12, 0, 0)),
            Infrared(longitude=-33.707665, latitude=151.162154, count=475, recorded_datetime=datetime(2025, 3, 14, 12, 10, 0)),
            Infrared(longitude=-33.708665, latitude=151.163154, count=150, recorded_datetime=datetime(2025, 3, 14, 12, 20, 0)),
            Infrared(longitude=-33.709665, latitude=151.164154, count=50, recorded_datetime=datetime(2025, 3, 14, 12, 30, 0)),
            Infrared(longitude=-33.710665, latitude=151.165154, count=250, recorded_datetime=datetime(2025, 3, 14, 12, 40, 0)),
            Infrared(longitude=-33.711665, latitude=151.166154, count=90, recorded_datetime=datetime(2025, 3, 14, 12, 50, 0)),
            Infrared(longitude=-33.712665, latitude=151.167154, count=1, recorded_datetime=datetime(2025, 3, 14, 13, 0, 0)),
            Infrared(longitude=-33.713665, latitude=151.168154, count=500, recorded_datetime=datetime(2025, 3, 14, 13, 10, 0)),
            Infrared(longitude=-33.714665, latitude=151.169154, count=300, recorded_datetime=datetime(2025, 3, 14, 13, 20, 0)),
            Infrared(longitude=-33.715665, latitude=151.170154, count=120, recorded_datetime=datetime(2025, 3, 14, 13, 30, 0))
        ]
        

        
        session.add_all(ir)

        session.commit()
        print("Sample data inserted into all tables!")



if __name__ == "__main__":
    reset_database()
    setup_database()  # Create the database and tables
    insert_sample_data()  # Insert initial data if necessary