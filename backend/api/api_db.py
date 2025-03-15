# db api blueprint
from flask import Blueprint, request, jsonify, send_from_directory, current_app
import pandas as pd
import traceback
import os
from helper_modules import db_helper as db


api_db = Blueprint('database', __name__)

# Dynamic route for executing SQL queries based on input from frontend
@api_db.route('/fetch_query', methods=['POST'])
def execute_query():
    try:
        # Get the SQL query from the frontend request
        data = request.json
        query = data.get('query')

        if not query:
            return jsonify({'error': 'No SQL query provided.'}), 400

        # Fetch data using the db_helper function
        df = db.fetch_data(query)

        # Convert the DataFrame to a list of dictionaries for JSON serialization
        if df is not None and not df.empty:
            result_data = df.to_dict(orient='records')
            return jsonify(result_data), 200
        else:
            return jsonify({'message': 'No data found.'}), 404

    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500
    

@api_db.route('/fetch_sensor_data', methods=['POST'])
def fetch_sensor_data():
    try:
        # Get the datetime from the frontend request
        data = request.json
        passed_datetime = data.get('dateTime')

        if not passed_datetime:
            return jsonify({'error': 'Invalid datetime provided.'}), 400

        # SQL query to get the most recent record before the passed datetime
        query = """
        WITH RankedData AS (
            SELECT 
                latitude, 
                longitude, 
                count, 
                recorded_datetime,
                ROW_NUMBER() OVER (
                    PARTITION BY latitude, longitude 
                    ORDER BY recorded_datetime DESC
                ) AS rn
            FROM Infrared
            WHERE recorded_datetime < :recorded_datetime
        )
        SELECT latitude, longitude, count, recorded_datetime
        FROM RankedData
        WHERE rn = 1;
        """

        # Fetch data using db_helper function\
        df = db.fetch_data(query, {"recorded_datetime": passed_datetime})

        # Convert DataFrame to JSON response
        if df is not None and not df.empty:
            result_data = df.to_dict(orient='records')  # Get the first row
            return jsonify(result_data), 200
        else:
            return jsonify({'message': 'No data found before the given datetime.'}), 404

    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500


@api_db.route('/update_sensor', methods=['POST'])
def update_user():
    data = request.json
    try:
        user_data = {
            'longitude': data['longitude'],
            'latitude':data['latitude'],
            'count':data['count'],
            'date_recorded':data['date_recorded'],
        }
        df = pd.DataFrame([user_data])
        success = db.upsert_data('Infared', df)
        if success:
            return jsonify({"message": "Infared table updated successfully"}), 200
        else:
            return jsonify({"message": f"Failed to update infared table {user_data}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
