#!/usr/bin/env python3
"""
Quick diagnostic and startup script for Impify backend
"""

import os
import sys
import subprocess
import time

def print_header():
    print("🚀 Impify Backend Quick Start")
    print("=" * 50)

def check_python():
    """Check if Python is available"""
    print("🐍 Checking Python...")
    python_version = sys.version_info
    print(f"✅ Python {python_version.major}.{python_version.minor}.{python_version.micro}")
    return True

def install_minimal_deps():
    """Install only the essential dependencies for auth to work"""
    print("\n📦 Installing minimal dependencies for authentication...")
    
    # Essential packages for basic Flask app to run
    essential_packages = [
        'flask==2.3.3',
        'flask-cors==6.0.1', 
        'flask-jwt-extended==4.7.1',
        'werkzeug==3.1.3',
        'python-dotenv==1.2.1'
    ]
    
    for package in essential_packages:
        try:
            print(f"Installing {package}...")
            result = subprocess.run([sys.executable, '-m', 'pip', 'install', package], 
                                 capture_output=True, text=True)
            if result.returncode != 0:
                print(f"⚠️ Warning: Could not install {package}")
                print(f"Error: {result.stderr}")
            else:
                print(f"✅ {package} installed")
        except Exception as e:
            print(f"❌ Failed to install {package}: {e}")
    
    return True

def check_server_file():
    """Check if server.py exists and is readable"""
    print("\n📄 Checking server.py...")
    if os.path.exists('server.py'):
        print("✅ server.py exists")
        
        # Check file size
        size = os.path.getsize('server.py')
        print(f"📊 File size: {size:,} bytes")
        
        # Try to read first few lines
        try:
            with open('server.py', 'r') as f:
                lines = f.readlines()[:10]
            print(f"✅ server.py is readable ({len(lines)} lines read)")
            return True
        except Exception as e:
            print(f"❌ Cannot read server.py: {e}")
            return False
    else:
        print("❌ server.py not found")
        return False

def create_minimal_server():
    """Create a minimal Flask server for testing"""
    print("\n🔧 Creating minimal test server...")
    
    minimal_server = '''#!/usr/bin/env python3
"""
Minimal Flask server for testing authentication
"""

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
import os
from datetime import timedelta

# Create Flask app
app = Flask(__name__)

# Configuration
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'test-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# Initialize extensions
jwt = JWTManager(app)
CORS(app, supports_credentials=True, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        "supports_credentials": True
    }
})

# Test endpoint
@app.route('/')
def home():
    return jsonify({
        "status": "ok",
        "message": "Impify minimal server is running!",
        "endpoints": {
            "auth": "/api/auth/test",
            "login": "/api/auth/login",
            "register": "/api/auth/register"
        }
    })

@app.route('/api/')
def api_info():
    return jsonify({
        "api": "Impify Backend",
        "version": "1.0.0-minimal",
        "status": "running"
    })

# Test authentication endpoint
@app.route('/api/auth/test')
def test_auth():
    return jsonify({
        "message": "Authentication is working!",
        "timestamp": "2024-01-01T00:00:00Z"
    })

# Minimal login endpoint
@app.route('/api/auth/login', methods=['POST'])
def login():
    return jsonify({
        "message": "Login endpoint is working!",
        "note": "This is a minimal server for testing connectivity"
    }), 200

# Minimal register endpoint
@app.route('/api/auth/register', methods=['POST']) 
def register():
    return jsonify({
        "message": "Register endpoint is working!",
        "note": "This is a minimal server for testing connectivity"
    }), 201

if __name__ == '__main__':
    print("🚀 Starting minimal Impify server...")
    print("🌐 Server will be available at: http://localhost:5000")
    print("📡 API endpoints: http://localhost:5000/api/")
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
'''
    
    try:
        with open('minimal_server.py', 'w') as f:
            f.write(minimal_server)
        print("✅ Created minimal_server.py")
        return True
    except Exception as e:
        print(f"❌ Failed to create minimal server: {e}")
        return False

def start_minimal_server():
    """Start the minimal server"""
    print("\n🚀 Starting minimal server...")
    print("This will help us test if basic connectivity works.")
    print("Press Ctrl+C to stop the server when done testing.")
    print("-" * 50)
    
    try:
        subprocess.run([sys.executable, 'minimal_server.py'])
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Failed to start server: {e}")

def check_dependencies():
    """Check if we can import the essential modules"""
    print("\n🧪 Testing imports...")
    
    modules = [
        ('flask', 'Flask'),
        ('flask_cors', 'CORS'),
        ('flask_jwt_extended', 'JWTManager')
    ]
    
    for module, name in modules:
        try:
            __import__(module)
            print(f"✅ {name} available")
        except ImportError as e:
            print(f"❌ {name} missing: {e}")
            return False
    
    return True

def main():
    """Main function"""
    print_header()
    
    # Basic checks
    check_python()
    
    if not check_dependencies():
        install_minimal_deps()
    
    if not check_server_file():
        create_minimal_server()
    
    print("\n💡 Next Steps:")
    print("1. Run: python minimal_server.py")
    print("2. Open browser to: http://localhost:5000")
    print("3. Test API: http://localhost:5000/api/auth/test")
    print("4. If this works, the full server should work too")
    
    # Ask user if they want to start the server
    try:
        response = input("\n🤔 Would you like to start the minimal server now? (y/n): ").lower().strip()
        if response in ['y', 'yes']:
            start_minimal_server()
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")

if __name__ == "__main__":
    main()