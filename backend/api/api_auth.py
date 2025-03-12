# auth blueprint
from flask import Blueprint, request, jsonify
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)
 