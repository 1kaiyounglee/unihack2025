from flask import Flask, jsonify
from flask_cors import CORS

# Import routes
from api.api_db import api_db

app = Flask(__name__)
# allow requests to be sent from frontend at port 3000
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}},           
                    supports_credentials=True)

# register blueprints for database and authentication
app.register_blueprint(api_db, url_prefix="/api/database")




if __name__ == "__main__":
    app.run(debug=True)
