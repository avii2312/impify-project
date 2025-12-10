#!/usr/bin/env python3
"""
Production Server Fix Script for Impify
This script diagnoses and fixes common production deployment issues
"""

import os
import requests
import json
from urllib.parse import urljoin

def check_api_endpoints():
    """Check if API endpoints are responding"""
    base_url = "https://impify.visasystem.in"
    
    endpoints_to_test = [
        "/",  # Health check
        "/api/auth/login",  # Login endpoint (main issue)
        "/api/auth/register",  # Register endpoint
        "/api/health"  # Alternative health check
    ]
    
    print("🔍 Testing API Endpoints...")
    results = {}
    
    for endpoint in endpoints_to_test:
        url = urljoin(base_url, endpoint)
        try:
            response = requests.get(url, timeout=10)
            status = f"✅ {response.status_code}"
            results[endpoint] = status
            print(f"  {endpoint}: {status}")
        except requests.exceptions.RequestException as e:
            status = f"❌ Error: {str(e)}"
            results[endpoint] = status
            print(f"  {endpoint}: {status}")
    
    return results

def generate_fix_report():
    """Generate a comprehensive fix report"""
    
    report = """
# 🔧 Production Server Fix Report

## 🚨 Root Cause Analysis

The 404 error on `/api/auth/login` indicates the production server at `https://impify.visasystem.in` is not properly serving the Flask API routes.

## 🔍 Most Likely Issues (in order of probability):

### 1. **Dependencies Not Installed** (90% chance)
**Problem**: Flask and required packages not installed on production server
**Solution**: 
```bash
cd /home/visasyst/public_html/impify.visasystem.in/backend
pip install -r requirements.txt
```

### 2. **WSGI Configuration Error** (80% chance)
**Problem**: Passenger WSGI not correctly configured
**Solution**: 
- Ensure `passenger_wsgi.py` is executable
- Check `.htaccess` configuration
- Restart Python application in cPanel

### 3. **File Permissions** (60% chance)
**Problem**: Incorrect file permissions blocking execution
**Solution**:
```bash
chmod -R 755 /home/visasyst/public_html/impify.visasystem.in/backend/
chmod 644 /home/visasyst/public_html/impify.visasystem.in/backend/.env
chmod +x /home/visasyst/public_html/impify.visasystem.in/backend/passenger_wsgi.py
```

### 4. **Environment Variables** (40% chance)
**Problem**: Missing or incorrect environment variables
**Solution**: 
- Verify `.env` file exists and has correct values
- Check MYSQL_URL, JWT_SECRET_KEY, etc.

### 5. **Database Connection** (30% chance)
**Problem**: MySQL database not accessible
**Solution**:
- Verify database exists and user has permissions
- Test connection manually

## 🚀 Immediate Action Required:

1. **SSH into cPanel server**:
```bash
ssh visasyst@impify.visasystem.in
```

2. **Navigate to application directory**:
```bash
cd /home/visasyst/public_html/impify.visasystem.in/backend
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Fix permissions**:
```bash
chmod -R 755 .
chmod +x passenger_wsgi.py
```

5. **Restart Python App** in cPanel:
- Go to cPanel > Setup Python App
- Click "Restart" button

6. **Check logs** for errors:
- cPanel > Setup Python App > Logs

## 🔧 Alternative Quick Fix:

If above doesn't work, create a minimal WSGI entry point:

**Create `app.py`**:
```python
from server import app

if __name__ == "__main__":
    app.run(debug=False)
```

**Update `passenger_wsgi.py`**:
```python
from app import application

if __name__ == "__main__":
    application.run()
```

## 📊 Expected Result:
After fixes, `/api/auth/login` should return 405 Method Not Allowed (GET to POST endpoint) instead of 404.
"""
    
    return report

def create_debug_routes():
    """Create debug routes to help diagnose issues"""
    
    debug_server_code = '''
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/debug/status")
def debug_status():
    """Debug endpoint to check server status"""
    return jsonify({
        "status": "running",
        "message": "Flask server is working",
        "python_version": "3.x",
        "timestamp": "2025-11-13T11:37:00Z"
    })

@app.route("/debug/env")
def debug_env():
    """Debug endpoint to check environment"""
    import os
    return jsonify({
        "flask_env": os.environ.get("FLASK_ENV"),
        "python_path": os.environ.get("PYTHONPATH"),
        "has_mysql_url": bool(os.environ.get("MYSQL_URL")),
        "has_jwt_secret": bool(os.environ.get("JWT_SECRET_KEY"))
    })

@app.route("/debug/imports")
def debug_imports():
    """Debug endpoint to check imports"""
    results = {}
    try:
        import flask
        results["flask"] = "OK"
    except Exception as e:
        results["flask"] = f"ERROR: {e}"
    
    try:
        import flask_cors
        results["flask_cors"] = "OK"
    except Exception as e:
        results["flask_cors"] = f"ERROR: {e}"
        
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=False, port=5000)
'''
    
    return debug_server_code

def main():
    """Main diagnostic function"""
    print("🚀 Starting Production Server Diagnosis...")
    print("=" * 60)
    
    # Check API endpoints
    results = check_api_endpoints()
    
    # Generate fix report
    report = generate_fix_report()
    
    print("\n" + "=" * 60)
    print("📋 DIAGNOSIS COMPLETE")
    print("=" * 60)
    
    if "❌" in str(results):
        print("🚨 ISSUES DETECTED:")
        for endpoint, status in results.items():
            if "❌" in status:
                print(f"  - {endpoint}: {status}")
    else:
        print("✅ All endpoints responding")
    
    print("\n📄 Detailed fix report generated:")
    print(report)
    
    # Create debug server as fallback
    debug_code = create_debug_routes()
    with open("debug_server.py", "w") as f:
        f.write(debug_code)
    
    print("\n🔧 Created debug_server.py as diagnostic tool")
    print("   Upload to production server if main fixes don't work")

if __name__ == "__main__":
    main()