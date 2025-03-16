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


@api_db.route('/calculate_event_population', methods=['GET'])
def calculate_event_population():
    try:
        query = """
        WITH InfraredNearby AS (
            SELECT i.latitude, i.longitude, i.count, i.recorded_datetime, e.id, e.name,
                (6371000 * acos(
                    cos(radians(e.latitude)) * cos(radians(i.latitude)) * 
                    cos(radians(i.longitude) - radians(e.longitude)) + 
                    sin(radians(e.latitude)) * sin(radians(i.latitude))
                )) AS distance_m
            FROM Infrared i
            JOIN Event e ON 1=1  -- Cartesian join to compare all event-infrared pairs
        ),
        RankedData AS (
            SELECT id, name, latitude, longitude, count, recorded_datetime, distance_m,
                ROW_NUMBER() OVER (
                    PARTITION BY latitude, longitude 
                    ORDER BY recorded_datetime DESC
                ) AS rn
            FROM InfraredNearby
            WHERE distance_m <= 100
        )
        SELECT e.id, e.name, e.latitude, e.longitude, COALESCE(SUM(r.count), 0) AS total_count
        FROM Event e
        LEFT JOIN RankedData r ON e.id = r.id
        WHERE r.rn = 1 OR r.rn IS NULL  -- Include events even if no matching data in Infrared
        GROUP BY e.id, e.name, e.latitude, e.longitude;
        """

        # Fetch data using db_helper function\
        df = db.fetch_data(query)

        # Convert DataFrame to JSON response
        if df is not None and not df.empty:
            result_data = df.to_dict(orient='records')
            return jsonify(result_data), 200
        else:
            return jsonify({'message': 'No data found'}), 404

    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500
    

@api_db.route('fetch_tripped_alerts', methods=['POST'])
def fetch_tripped_alerts():
    try:
        query = """
        WITH InfraredNearby AS (
            SELECT i.latitude AS infrared_lat, i.longitude AS infrared_lon, i.count, i.recorded_datetime, 
                a.latitude AS alert_lat, a.longitude AS alert_lon, a.radius, a.threshold,
                (6371000 * acos(
                    cos(radians(a.latitude)) * cos(radians(i.latitude)) * 
                    cos(radians(i.longitude) - radians(a.longitude)) + 
                    sin(radians(a.latitude)) * sin(radians(i.latitude))
                )) AS distance_m
            FROM Infrared i
            JOIN Alerts a ON 1=1  -- Cartesian join to compare all alert-infrared pairs
        ),
        RankedData AS (
            SELECT alert_lat, alert_lon, infrared_lat, infrared_lon, count, recorded_datetime, distance_m, radius, threshold,
                ROW_NUMBER() OVER (
                    PARTITION BY infrared_lat, infrared_lon 
                    ORDER BY recorded_datetime DESC
                ) AS rn
            FROM InfraredNearby
            WHERE distance_m <= radius  -- Use alert-specific radius
        )
        SELECT a.latitude, a.longitude, COALESCE(SUM(r.count), 0) AS total_count
        FROM Alerts a
        LEFT JOIN RankedData r 
            ON a.latitude = r.alert_lat 
            AND a.longitude = r.alert_lon
            AND r.rn = 1  -- Ensure only the most recent sensor reading per lat-lon is used
        GROUP BY a.latitude, a.longitude, a.threshold
        HAVING COALESCE(SUM(r.count), 0) >= a.threshold;
        """

        # Fetch data using db_helper function\
        df = db.fetch_data(query)

        # Convert DataFrame to JSON response
        if df is not None and not df.empty:
            result_data = df.to_dict(orient='records')
            return jsonify(result_data), 200
        else:
            return jsonify({'message': 'No data found'}), 404

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
    

@api_db.route('/create_alert', methods=['POST'])
def create_alert():
    data = request.json
    try:
        alert_data = {
            'latitude'      :data['latitude'],
            'longitude'     :data['longitude'],
            'radius'        :data['radius'],
            'threshold'     :data['threshold'],
        }
        df = pd.DataFrame([alert_data])
        success = db.insert_alert(df)
        if success:
            return jsonify({"message": "Infared table updated successfully"}), 200
        else:
            return jsonify({"message": f"Failed to update infared table {alert_data}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
