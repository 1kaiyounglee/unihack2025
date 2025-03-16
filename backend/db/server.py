from flask import Flask, jsonify
from sqlalchemy import func
from db_config import Session
from models import Infrared, Event

app = Flask(__name__)

@app.route('/api/busyness', methods=['GET'])
def get_busyness():
    # (Existing endpoint for sensor-based grouping)
    with Session() as session:
        results = session.query(
            Infrared.latitude,
            Infrared.longitude,
            func.avg(Infrared.count).label("avg_count")
        ).group_by(Infrared.latitude, Infrared.longitude).all()

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

@app.route('/api/locations', methods=['GET'])
def get_locations():
    with Session() as session:
        # Query all events from the sample database
        events = session.query(Event).all()
        locations = []
        for event in events:
            # Compute the average sensor count for the event's coordinates
            avg_count = session.query(func.avg(Infrared.count)).filter(
                Infrared.latitude == event.latitude,
                Infrared.longitude == event.longitude
            ).scalar() or 0

            # Determine busyness level based on average count
            if avg_count < 50:
                level = "Not Busy"
            elif avg_count < 150:
                level = "Moderately Busy"
            else:
                level = "Very Busy"

            locations.append({
                "value": f"{event.latitude},{event.longitude}",
                # Use the event's description as the location name and show coordinates
                "label": f"{event.description} ({event.latitude:.2f}, {event.longitude:.2f}) - {level}",
                "peopleCount": int(avg_count),
                "busyness": level
            })
        return jsonify(locations)

# New endpoint to fetch events with people count (if needed)
@app.route('/api/events', methods=['GET'])
def get_events():
    with Session() as session:
        events = session.query(Event).all()
        event_list = []
        for event in events:
            avg_count = session.query(func.avg(Infrared.count)).filter(
                Infrared.latitude == event.latitude,
                Infrared.longitude == event.longitude
            ).scalar() or 0
            event_list.append({
                "id": event.id,
                "name": event.name,
                # Use the location description as the location name
                "location": event.description,
                "latitude": event.latitude,
                "longitude": event.longitude,
                "start_datetime": event.start_datetime.isoformat(),
                "duration": event.duration,
                "peopleCount": int(avg_count),
                # If you have additional fields like image or attendees, include them:
                "image": getattr(event, 'image', ''),
                "attendees": getattr(event, 'attendees', 0)
            })
        return jsonify(event_list)

if __name__ == '__main__':
    app.run(debug=True)
