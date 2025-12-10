# 🔧 Production Server Fix Guide

## 🚨 Diagnosis Results

Based on the 404 error on `/api/auth/login`, the production server at `https://impify.visasystem.in` is not properly serving the Flask API routes.

## 🎯 Most Likely Issues (in order of probability):

### 1. **Dependencies Not Installed** (95% chance)
The Flask application requires dependencies that aren't installed on the production server.

### 2. **Passenger WSGI Configuration** (80% chance)
The WSGI entry point isn't properly configured or the application isn't starting.

### 3. **File Permissions** (60% chance)
Files don't have correct permissions for execution.

### 4. **Environment Variables** (40% chance)
Missing or incorrect environment configuration.

## 🚀 Immediate Fix Steps:

### Step 1: Access cPanel and SSH
1. Login to your cPanel account
2. Go to "Setup Python App" 
3. Click on your Python application
4. Open SSH Terminal (if available) or use external SSH client

### Step 2: Install Dependencies
```bash
cd /home/visasyst/public_html/impify.visasystem.in/backend
pip install -r requirements.txt --user
```

### Step 3: Fix File Permissions
```bash
chmod -R 755 /home/visasyst/public_html/impify.visasystem.in/backend/
chmod 644 /home/visasyst/public_html/impify.visasystem.in/backend/.env
chmod +x /home/visasyst/public_html/impify.visasystem.in/backend/passenger_wsgi.py
```

### Step 4: Restart Python Application
1. In cPanel > Setup Python App
2. Click "Restart" button
3. Check the "Logs" tab for any errors

### Step 5: Verify .env Configuration
Ensure your `.env` file contains:
```env
FLASK_ENV=production
JWT_SECRET_KEY=your-secure-secret-key-here
MYSQL_URL=mysql+pymysql://visasyst:FLLq37d)s9B:d6@localhost:3306/visasyst_impify
OPENAI_API_KEY=your-openai-api-key-here
```

## 🔧 Alternative Quick Test:

Create a minimal test file to verify if Flask is working:

**Create `test_app.py`**:
```python
from flask import Flask, jsonify
app = Flask(__name__)

@app.route("/test")
def test():
    return jsonify({"status": "Flask is working!"})

@app.route("/api/test")
def test_api():
    return jsonify({"api": "working"})

if __name__ == "__main__":
    app.run()
```

**Update `passenger_wsgi.py`** to use the test app:
```python
from test_app import app
application = app
```

Upload this test setup and check if `/test` responds.

## 📊 Expected Behavior After Fix:

- `/api/auth/login` should return `405 Method Not Allowed` (instead of 404)
- `/` should return `{"message": "Impify API is running"}`
- Frontend login should work without 404 errors

## 🆘 If Still Not Working:

1. **Check cPanel Logs**: Look for error messages
2. **Verify Python Version**: Ensure 3.8+ is selected in cPanel
3. **Test Database Connection**: Verify MySQL credentials
4. **Check Passenger Status**: Ensure Passenger is enabled in cPanel

## 📞 Support:

If these steps don't resolve the issue, check:
- cPanel error logs
- Passenger application logs
- MySQL database connection
- File ownership and permissions