import sys
import os

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

# Set environment variables
os.environ['FLASK_ENV'] = 'production'

# Import the Flask application
from server import app as application

if __name__ == "__main__":
    application.run()