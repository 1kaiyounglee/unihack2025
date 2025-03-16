from sqlalchemy.orm import sessionmaker
import pandas as pd
import traceback
from sqlalchemy import text, inspect, Boolean
from db.db_config import Session
import sys, os, re
from datetime import datetime
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)


def fetch_data(query, params=None):
    """
    Fetches data from the database using a raw SQL query and returns a pandas DataFrame.
    Automatically converts BOOLEAN-like columns to Python booleans.
    
    Args:
        query (str): The SQL query to execute.
        params (dict): Optional dictionary of parameters to bind to the query.
    
    Returns:
        pd.DataFrame: A pandas DataFrame containing the retrieved rows, with boolean columns converted.
    """
    try:
        df = []
        with Session() as session:

            # Extract table name from the SQL query
            table_name = extract_table_name(query)

            # Execute the raw SQL query
            if params:
                result = session.execute(text(query), params)
            else:
                result = session.execute(text(query))

            # Fetch all rows and column names
            rows = result.fetchall()
            column_names = result.keys()

            # Convert to a pandas DataFrame
            df = pd.DataFrame(rows, columns=column_names)

            
            # Close the session
            session.close()

        return df
    except Exception:
        print(traceback.format_exc())
        return None
    
def upsert_data(table_name, df):
    """
    Performs an UPSERT operation on the specified table using the data in the DataFrame.
    
    Args:
        table_name (str): The name of the table to upsert data into.
        df (pd.DataFrame): The DataFrame containing data to insert/update.
    
    Returns:
        bool: True if the operation is successful, False otherwise.
    """
    session = None
    try:
        session = Session()

        # Ensure all required columns are in the df
        table_metadata = session.execute(text(f"PRAGMA table_info({table_name})")).fetchall()

        table_columns = {col[1]: col for col in table_metadata}  # Dictionary of column names and info

        # Add default values for missing columns, if necessary
        for col_name, col_info in table_columns.items():
            if col_name not in df.columns and col_info[4] is not None:  # col_info[4] is the default value
                df[col_name] = col_info[4]  # Assign the default value to the missing column

        # Prepare the insert/update SQL
        columns = df.columns.tolist()
        values = df.iloc[0].to_dict()

        # Build SQL query
        column_names = ', '.join(columns)
        value_placeholders = ', '.join([f":{col}" for col in columns])

        # Conflict target is assumed to be the first column (e.g., email)
        conflict_target = columns[0]
        set_clause = ', '.join([f"{col} = :{col}" for col in columns if col != conflict_target])

        # Construct the UPSERT SQL command
        cmd_text = f"""
        INSERT INTO {table_name} ({column_names})
        VALUES ({value_placeholders})
        ON CONFLICT ({conflict_target})
        DO UPDATE SET {set_clause};
        """

        # Execute the UPSERT
        session.execute(text(cmd_text), values)
        session.commit()

        print("UPSERT operation completed successfully.")
        return True

    except Exception as e:
        if session:
            session.rollback()  # Rollback in case of error
        print(f"Error during UPSERT operation: {e}")
        return False
    finally:
        if session:
            session.close()
  
def execute_query(query, params=None):
    """
    Executes a given SQL query and returns the result.
    
    Args:
        query (str): The SQL query to execute.
        params (dict): Optional dictionary of parameters to bind to the query.
    
    Returns:
        ResultProxy: The result of the query execution (can be iterated over for SELECT queries).
    """
    session = None
    try:
        session = Session()  # Get a new database session

        if params:
            result = session.execute(text(query), params)
        else:
            result = session.execute(text(query))

        session.commit()  # Commit the transaction if it's a modification query (e.g., DELETE, UPDATE, INSERT)

        return result  # Return the result object for further processing (e.g., row count for DELETE)
    except Exception as e:
        if session:
            session.rollback()  # Rollback the transaction in case of error
        print(f"Error executing query: {traceback.format_exc()}")
        return None
    finally:
        if session:
            session.close()  # Always close the session after the query is done

def make_backup(tablename):
    df = fetch_data(f"SELECT * FROM {tablename}")
    
    if df is None or df.empty:
        print(f"No data found in table: {tablename}")
        return
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    backup_folder = os.path.join(current_dir, "..", "db", "backups")
    
    if not os.path.exists(backup_folder):
        os.makedirs(backup_folder)
    
    current_time = datetime.now().strftime("%d-%m-%Y_%H-%M")
    
    backup_file = os.path.join(backup_folder, f"{tablename} backup - {current_time}.json")
    
    try:
        df.to_json(backup_file, orient='records', indent=4)  
        print(f"Backup of {tablename} saved to {backup_file}")
    except Exception as e:
        print(f"Error saving backup: {traceback.format_exc()}")


def read_backup(filename):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    backup_folder = os.path.join(current_dir, "..", "db", "backups")
    backup_file = os.path.join(backup_folder, filename)

    if not os.path.exists(backup_file):
        print(f"File {filename} does not exist in backups folder.")
        return None
    
    try:
        df = pd.read_json(backup_file)
        print(f"Backup {filename} successfully read.")
        return df
    except Exception as e:
        print(f"Error reading backup: {e}")
        return None
    


def extract_table_name(query):
    """
    Extracts the table name from the SQL query string.
    
    Args:
        query (str): The SQL query to parse.
    
    Returns:
        str: The extracted table name or None if no table name is found.
    """
    match = re.search(r'FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)', query, re.IGNORECASE)
    if match:
        return match.group(1)
    return None





def insert_alert(df):
    try:
        # build query from alert
        for index, row in df.iterrows():
            query = """
            INSERT INTO Alerts (latitude, longitude, radius, threshold)
            VALUES (:latitude, :longitude, :radius, :threshold);
            """
            values = {
                'latitude': row['latitude'],
                'longitude': row['longitude'],
                'radius': row['radius'],
                'threshold': row['threshold']
            }

            execute_query(query, values)
        
        print("Data inserted successfully.")
    except Exception as e:
        print(f"Error during insert operation: {e}")
