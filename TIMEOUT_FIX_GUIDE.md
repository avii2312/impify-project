# ⏰ Backend Timeout Issue - Complete Fix Guide

## 🔍 Issue Analysis

**Current Problem**: Frontend timeout error when trying to connect to backend
```
axios.js:33 ❌ API Error: /api/auth/login undefined timeout of 10000ms exceeded
```

**Root Cause**: The backend server is not running or responding to requests on port 5000.

## 🛠️ Step-by-Step Solution

### Step 1: Test Backend Connectivity

First, let's test if we can reach the backend at all:

1. **Open your browser and visit**:
   ```
   http://localhost:5000
   ```

2. **Check browser console** for any connection errors

### Step 2: Start the Test Server

Run the simple test server to verify basic functionality:

```bash
cd backend
python simple_test_server.py
```

This server:
- ✅ Installs missing dependencies automatically
- ✅ Provides working authentication endpoints
- ✅ Uses test data (no database required)
- ✅ Logs all requests to console

### Step 3: Verify Server Response

If the server starts successfully, you should see:
```
🚀 Starting Impify Test Server...
🌐 Server will be available at: http://localhost:5000
📡 API base URL: http://localhost:5000/api/
🔑 Test credentials:
   Email: test@example.com
   Password: testpassword123
✅ Test user created
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://[your-ip]:5000
```

### Step 4: Test API Endpoints

Open browser tabs for these URLs to verify each endpoint:

1. **Home**: http://localhost:5000
2. **API Info**: http://localhost:5000/api/
3. **Health Check**: http://localhost:5000/api/health
4. **Auth Test**: http://localhost:5000/api/auth/login

### Step 5: Test Frontend Connection

1. **Open frontend** in browser: http://localhost:3000
2. **Open Developer Console** (F12)
3. **Try to login** with:
   - Email: `test@example.com`
   - Password: `testpassword123`

You should see successful responses in the backend console.

## 🔧 If Test Server Works

If the test server works, the issue is likely with the full server configuration. The full server might have:
- Database connection problems
- Missing environment variables
- Dependency conflicts

### Switch to Full Server

Once you confirm connectivity works:
```bash
# Stop the test server (Ctrl+C)
# Start the full server
python server.py
```

## 🚫 If Test Server Doesn't Work

If the test server also fails to start:

### Install Dependencies Manually

```bash
pip install flask flask-cors flask-jwt-extended werkzeug python-dotenv
```

### Check Python Environment

```bash
python --version
# Should be Python 3.7+

pip --version
# Should be available
```

### Check Port Conflicts

```bash
# On Windows
netstat -ano | findstr :5000

# On Mac/Linux  
netstat -an | grep :5000
```

If port 5000 is already in use, the server will fail to start.

## 🔍 Troubleshooting Common Issues

### "ModuleNotFoundError: No module named 'flask'"
**Solution**: Install dependencies
```bash
pip install flask flask-cors flask-jwt-extended werkzeug python-dotenv
```

### "Address already in use"
**Solution**: Port 5000 is taken
```bash
# Kill process using port 5000
# On Windows:
taskkill /PID [PID_NUMBER] /F

# On Mac/Linux:
kill -9 [PID_NUMBER]
```

### "Database connection failed"
**Solution**: Use test server first, then fix database later
```bash
python simple_test_server.py
```

### "CORS policy blocked"
**Solution**: Verify CORS config includes your frontend URL
- Frontend should be on `http://localhost:3000`
- Backend CORS should include `http://localhost:3000`

## 📋 Testing Checklist

- [ ] Backend server starts without errors
- [ ] http://localhost:5000 returns JSON response
- [ ] http://localhost:5000/api/health returns status: "healthy"
- [ ] Frontend can reach backend without timeout
- [ ] Login form accepts test credentials
- [ ] Login returns success response

## 🚀 Quick Start Sequence

1. **Start Backend**:
   ```bash
   cd backend
   python simple_test_server.py
   ```

2. **Start Frontend** (in new terminal):
   ```bash
   cd frontend
   npm start
   ```

3. **Test in Browser**:
   - Open http://localhost:3000
   - Try logging in with test credentials
   - Check browser console for success messages

## 📞 Expected Results

✅ **Success Indicators**:
- Backend console shows "Login successful"
- Frontend shows successful login message
- User is redirected to dashboard
- No timeout errors in console

❌ **Failure Indicators**:
- Backend server won't start
- Connection refused errors
- CORS errors
- Timeout errors in frontend console

## 🔄 Next Steps

Once the test server works:
1. Try the full `server.py` to see if it starts
2. If full server has issues, fix database connection
3. Use test server for development until full server is ready

The timeout issue should be completely resolved once the backend server is running and responding on port 5000.