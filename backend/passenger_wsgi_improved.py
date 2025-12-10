import sys
import os

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

# Set environment variables
os.environ['FLASK_ENV'] = 'production'
os.environ['PYTHONPATH'] = os.path.dirname(__file__)

# Try to import main application first
try:
    from server import app as application
    print("✅ Main server loaded successfully")
except Exception as e:
    print(f"⚠️  Main server failed to load: {e}")
    print("🔧 Falling back to test application...")
    
    try:
        from test_app import app as application
        print("✅ Test application loaded successfully")
    except Exception as e2:
        print(f"❌ Both main and test applications failed to load: {e2}")
        print("📝 Creating minimal emergency application...")
        
        # Emergency fallback - create minimal Flask app
        from flask import Flask, jsonify
        application = Flask(__name__)
        
        @application.route("/")
        def emergency_health():
            return jsonify({
                "message": "Emergency server is running",
                "status": "critical",
                "note": "Main application failed to load"
            })
        
        @application.route("/api/auth/login")
        def emergency_login():
            return jsonify({
                "error": "Server in maintenance mode",
                "message": "Emergency fallback active"
            }), 503

# Application entry point for Passenger
if __name__ == "__main__":
    # This will be handled by Passenger WSGI
    pass