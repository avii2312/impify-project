from flask import Flask, jsonify

# Minimal test Flask application
app = Flask(__name__)

@app.route("/")
def health_check():
    return jsonify({"message": "Impify API is running", "status": "healthy"})

@app.route("/test")
def test():
    return jsonify({"status": "Flask is working!"})

@app.route("/api/test")
def test_api():
    return jsonify({"api": "working", "endpoints": ["auth/login", "auth/register"]})

@app.route("/api/health")
def api_health():
    return jsonify({"api": "healthy", "version": "1.0.0"})

# Import the main server routes after creating the app
try:
    from server import app as main_app
    # If we get here, main server is importable
    print("✅ Main server module loaded successfully")
except Exception as e:
    print(f"⚠️  Main server import failed: {e}")
    print("📝 Using minimal test server instead")

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5000)