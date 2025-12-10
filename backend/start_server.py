#!/usr/bin/env python3
"""
Startup script for Impify backend server
This script helps diagnose and start the authentication system properly.
"""

import os
import sys
import subprocess

def install_dependencies():
    """Install required Python dependencies"""
    print("📦 Installing required dependencies...")
    
    # Core dependencies that are essential for auth to work
    core_deps = [
        'flask',
        'flask-cors', 
        'flask-jwt-extended',
        'werkzeug',
        'flask-sqlalchemy',
        'python-dotenv',
        'pymysql',
        'pytz'
    ]
    
    for dep in core_deps:
        try:
            print(f"Installing {dep}...")
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', dep])
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install {dep}: {e}")
            return False
    
    print("✅ Dependencies installed successfully!")
    return True

def check_environment():
    """Check environment configuration"""
    print("\n🔍 Checking environment...")
    
    # Check .env file
    env_file = '.env'
    if os.path.exists(env_file):
        print(f"✅ {env_file} exists")
        with open(env_file, 'r') as f:
            content = f.read()
            if 'MYSQL_URL' in content:
                print("✅ Database configuration found")
            if 'JWT_SECRET_KEY' in content:
                print("✅ JWT configuration found")
    else:
        print(f"❌ {env_file} not found")
        return False
    
    return True

def test_imports():
    """Test if all required modules can be imported"""
    print("\n🧪 Testing imports...")
    
    try:
        from flask import Flask
        print("✅ Flask imported successfully")
    except ImportError as e:
        print(f"❌ Flask import failed: {e}")
        return False
    
    try:
        from flask_cors import CORS
        print("✅ Flask-CORS imported successfully")
    except ImportError as e:
        print(f"❌ Flask-CORS import failed: {e}")
        return False
    
    try:
        from flask_jwt_extended import JWTManager
        print("✅ Flask-JWT-Extended imported successfully")
    except ImportError as e:
        print(f"❌ Flask-JWT-Extended import failed: {e}")
        return False
    
    try:
        from werkzeug.security import generate_password_hash
        print("✅ Werkzeug imported successfully")
    except ImportError as e:
        print(f"❌ Werkzeug import failed: {e}")
        return False
    
    return True

def start_server():
    """Start the Flask server"""
    print("\n🚀 Starting Impify server...")
    
    try:
        # Import and run the server
        from server import app
        print("✅ Server module imported successfully")
        print("🌐 Server will be available at: http://localhost:5000")
        print("📡 API endpoints available at: http://localhost:5000/api/")
        print("\n🔑 Authentication endpoints:")
        print("   POST /api/auth/login")
        print("   POST /api/auth/register") 
        print("   GET  /api/auth/verify")
        print("\nPress Ctrl+C to stop the server")
        print("-" * 50)
        
        # Start the server
        app.run(host='0.0.0.0', port=5000, debug=True)
        
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

def main():
    """Main startup function"""
    print("🚀 Impify Backend Startup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('server.py'):
        print("❌ server.py not found. Please run this script from the backend directory.")
        sys.exit(1)
    
    # Install dependencies if needed
    if not test_imports():
        print("\n💡 Some dependencies are missing. Installing...")
        if not install_dependencies():
            print("❌ Failed to install dependencies. Please install manually:")
            print("   pip install flask flask-cors flask-jwt-extended werkzeug flask-sqlalchemy python-dotenv pymysql pytz")
            sys.exit(1)
        
        # Test imports again after installation
        if not test_imports():
            print("❌ Dependencies still not working. Please check your Python environment.")
            sys.exit(1)
    
    # Check environment
    if not check_environment():
        print("❌ Environment check failed. Please ensure .env file exists and is properly configured.")
        sys.exit(1)
    
    # Start the server
    start_server()

if __name__ == "__main__":
    main()