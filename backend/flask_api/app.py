import sys
import os

# Dodaj ścieżkę do katalogu backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from app import create_app
from flask_cors import CORS 

app = create_app()

CORS(app, origins=["http://localhost:5173"])


if __name__ == '__main__':
    app.run(debug=True, port=8080)