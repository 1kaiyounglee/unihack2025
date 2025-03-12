from flask import Flask, jsonify
from flask_cors import CORS

# Import routes
from api.api_db import api_db
from api.api_auth import auth_bp 

app = Flask(__name__)
CORS(app)  

# Register blueprints for database and authentication
app.register_blueprint(api_db, url_prefix="/api/database")
app.register_blueprint(auth_bp, url_prefix="/api/auth")  



@app.route('/api/hello', methods=['GET'])
def hello_world():
    return jsonify({'message': 'test'})

if __name__ == "__main__":
    app.run(debug=True)
