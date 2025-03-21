import traceback
from helper_modules import db_helper as db
import pandas as pd


def fetch_and_print_all_tables():
    queries = {
        "Infrared": "SELECT * FROM Infrared;",
        

    }
    
    for table, query in queries.items():
        print(f"Fetching data from {table} table:")
        data = db.fetch_data(query)
        if data is not None:
            print(data)
        else:
            print(f"No data found or error in fetching data from {table}.")
        print("\n" + "="*75 + "\n")
