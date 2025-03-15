from yolov4_image import process_image
from image_capture import capture_image
from table_update import table_update
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pandas as pd
import time
import os
import sys

parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(parent_dir)  # Add backend/ to sys.path
from helper_modules import db_helper as db

db_models_path = os.path.join(parent_dir, "db")
sys.path.append(db_models_path)
from db.models import Infrared
capture_interval = 300 # 300 seconds is 5 minutes

#update for each location
longitude = -33.91736 
latitude = 151.23158 #COORDS for UNSW



while True:
    # Define the directory where images are stored
    image_directory = "C:/Users/kyanj/Documents/UNIHACK2025/unihack2025/backend/image_cap/images"
    print(capture_image())
    # Run the function and get detected people count
    detected_people = process_image(image_directory)

    # Use detected_people count for further processing (e.g., update database)
    print(f"Detected {detected_people} people in the last image.")

    # Implement table update
    table_update(detected_people,longitude,latitude)




    # wait for time interval to reset
    time.sleep(capture_interval)