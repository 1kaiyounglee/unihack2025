import pandas as pd
from datetime import datetime
import os
import sys

parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(parent_dir)  # Add backend/ to sys.path
from helper_modules import db_helper as db

def table_update(people_count,longitude,latitude):

    #Add info
    new_data = {
        "id": None,
        "longitude": longitude,
        "latitude": latitude,
        "count": people_count,
        "recorded_datetime": datetime.now()
    }

    df = pd.DataFrame([new_data])
    df["recorded_datetime"] = df["recorded_datetime"].dt.strftime("%Y-%m-%d %H:%M:%S")

    db.upsert_data("Infrared", df)