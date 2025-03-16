from flask import Flask, jsonify
from sqlalchemy import func
from db_config import Session
from models import Infrared

app = Flask(__name__)

@app.route('/api/busyness', methods=['GET'])
def get_busyness():
    with Session() as session:
        # Group sensor readings by location and compute average count
        results = session.query(
            Infrared.latitude,
            Infrared.longitude,
            func.avg(Infrared.count).label("avg_count")
        ).group_by(Infrared.latitude, Infrared.longitude).all()

        # Convert sensor data into a list of dropdown options
        options = []
        for lat, lon, avg_count in results:
            if avg_count < 50:
                level = "Not Busy"
            elif avg_count < 150:
                level = "Moderately Busy"
            else:
                level = "Very Busy"
            options.append({
                "value": f"{lat},{lon}",
                "label": f"{level} area ({lat:.2f}, {lon:.2f})"
            })
    return jsonify(options)

if __name__ == '__main__':
    app.run(debug=True)
