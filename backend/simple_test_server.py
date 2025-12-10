#!/usr/bin/env python3
"""
Simple test server to verify authentication functionality
Run this first to test connectivity, then run the full server
"""

import sys
import os

# Simple Flask server with just authentication endpoints
try:
    from flask import Flask, jsonify, request
    from flask_cors import CORS
    from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
    from datetime import timedelta
    import json
    from werkzeug.security import generate_password_hash, check_password_hash
    import uuid
    from datetime import datetime
    import pytz
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Installing required packages...")
    os.system(f"{sys.executable} -m pip install flask flask-cors flask-jwt-extended werkzeug python-dotenv")
    try:
        from flask import Flask, jsonify, request
        from flask_cors import CORS
        from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
        from datetime import timedelta
        import json
        from werkzeug.security import generate_password_hash, check_password_hash
        import uuid
        from datetime import datetime
        import pytz
    except ImportError:
        print("❌ Still cannot import required packages")
        sys.exit(1)

# Create Flask app
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'impify-test-secret-key-2024'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# Initialize extensions
jwt = JWTManager(app)
CORS(app, supports_credentials=True, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "http://127.0.0.1:3000", 
            "http://localhost:5000",
            "http://127.0.0.1:5000"
        ],
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        "supports_credentials": True
    }
})

# Simple in-memory user storage for testing
test_users = {}

def create_test_user():
    """Create a test user for testing"""
    email = "test@example.com"
    password = "testpassword123"
    if email not in test_users:
        test_users[email] = {
            'id': str(uuid.uuid4()),
            'email': email,
            'name': 'Test User',
            'password': generate_password_hash(password),
            'role': 'user',
            'created_at': datetime.now(pytz.timezone('Asia/Kolkata'))
        }
    return test_users[email]

# Routes
@app.route('/')
def home():
    """Home endpoint"""
    return jsonify({
        "message": "Impify Test Server Running!",
        "status": "ok",
        "endpoints": {
            "health": "/api/health",
            "login": "/api/auth/login",
            "register": "/api/auth/register", 
            "verify": "/api/auth/verify",
            "test_user": "test@example.com / testpassword123"
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/')
def api_info():
    """API info endpoint"""
    return jsonify({
        "api": "Impify Test Backend",
        "version": "1.0.0-test",
        "status": "running",
        "test_mode": True
    })

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "test_users": len(test_users)
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login endpoint"""
    try:
        data = request.get_json()
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        
        print(f"🔐 Login attempt: {email}")
        
        # Create test user if not exists
        test_user = create_test_user()
        
        if email == test_user['email'] and check_password_hash(test_user['password'], password):
            # Create access token
            access_token = create_access_token(
                identity=test_user['id'],
                additional_claims={'role': test_user['role']}
            )
            
            user_data = {
                'id': test_user['id'],
                'email': test_user['email'],
                'name': test_user['name'],
                'role': test_user['role']
            }
            
            print(f"✅ Login successful for: {email}")
            
            return jsonify({
                'success': True,
                'token': access_token,
                'user': user_data,
                'message': 'Login successful'
            }), 200
        else:
            print(f"❌ Login failed for: {email}")
            return jsonify({
                'success': False,
                'error': 'Invalid email or password'
            }), 401
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return jsonify({
            'success': False,
            'error': 'Login failed'
        }), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Registration endpoint"""
    try:
        data = request.get_json()
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        name = data.get('name', '')
        
        print(f"📝 Registration attempt: {email}")
        
        # For testing, just create the test user
        test_user = create_test_user()
        
        print(f"✅ Registration successful for: {email}")
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'user': {
                'id': test_user['id'],
                'email': test_user['email'],
                'name': test_user['name'],
                'role': test_user['role']
            }
        }), 201
        
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return jsonify({
            'success': False,
            'error': 'Registration failed'
        }), 500

@app.route('/api/auth/verify', methods=['GET'])
@jwt_required()
def verify_token():
    """Token verification endpoint"""
    try:
        user_id = get_jwt_identity()
        print(f"🔍 Token verification for user: {user_id}")
        
        # For testing, return a mock user
        return jsonify({
            'valid': True,
            'user': {
                'id': user_id,
                'email': 'test@example.com',
                'name': 'Test User',
                'role': 'user'
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Token verification error: {e}")
        return jsonify({
            'valid': False,
            'error': 'Invalid token'
        }), 401

if __name__ == '__main__':
    print("🚀 Starting Impify Test Server...")
    print("=" * 50)
    print("🌐 Server will be available at: http://localhost:5000")
    print("📡 API base URL: http://localhost:5000/api/")
    print("🔑 Test credentials:")
    print("   Email: test@example.com")
    print("   Password: testpassword123")
    print("=" * 50)
    print("Press Ctrl+C to stop the server")
    
    # Create test user
    create_test_user()
    print("✅ Test user created")
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Server error: {e}")