from flask import Flask
from .routes import routes_bp
import os

def create_app():
    app = Flask(__name__, static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static')))
    app.register_blueprint(routes_bp)
    return app