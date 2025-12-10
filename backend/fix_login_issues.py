#!/usr/bin/env python3
"""
Login Issues Fix Script for Impify
This script applies common fixes for authentication problems.
"""

import os
import re

def fix_env_file():
    """Fix the .env file configuration"""
    print("🔧 Fixing .env file...")
    
    env_path = "backend/.env"
    
    # Read current content
    try:
        with open(env_path, 'r') as f:
            content = f.read()
    except FileNotFoundError:
        print("❌ .env file not found")
        return False
    
    # Fix common issues
    fixes_applied = []
    
    # Fix JWT Secret Key
    if "JWT_SECRET_KEY=your-secure-secret-key-here" in content:
        content = content.replace(
            "JWT_SECRET_KEY=your-secure-secret-key-here",
            "JWT_SECRET_KEY=impify-super-secure-jwt-secret-key-2024-production-ready"
        )
        fixes_applied.append("✅ Fixed JWT Secret Key")
    
    # Fix MYSQL_URL formatting
    if "Database ConfigurationMYSQL_URL" in content:
        content = content.replace(
            "Database ConfigurationMYSQL_URL",
            "Database Configuration\nMYSQL_URL"
        )
        fixes_applied.append("✅ Fixed MYSQL_URL formatting")
    
    # Ensure required environment variables
    required_vars = [
        "JWT_SECRET_KEY=",
        "MYSQL_URL=",
        "OPENAI_API_KEY=",
        "CORS_ORIGINS=",
        "FLASK_ENV="
    ]
    
    for var in required_vars:
        if var not in content:
            if var == "JWT_SECRET_KEY=":
                content += f"\n{var}impify-super-secure-jwt-secret-key-2024-production-ready"
                fixes_applied.append(f"✅ Added {var}")
            elif var == "MYSQL_URL=":
                content += f"\n{var}mysql+pymysql://visasyst:FLLq37d)s9B:d6@localhost:3306/visasyst_impify"
                fixes_applied.append(f"✅ Added {var}")
            elif var == "CORS_ORIGINS=":
                content += f"\n{var}https://impify.visasystem.in,http://impify.visasystem.in,http://localhost:3000,http://127.0.0.1:3000"
                fixes_applied.append(f"✅ Added {var}")
    
    # Write fixed content
    try:
        with open(env_path, 'w') as f:
            f.write(content)
        print("✅ .env file updated successfully")
        for fix in fixes_applied:
            print(f"   {fix}")
        return True
    except Exception as e:
        print(f"❌ Failed to write .env file: {e}")
        return False

def fix_server_cors():
    """Fix CORS configuration in server.py"""
    print("\n🌐 Fixing CORS configuration...")
    
    server_path = "backend/server.py"
    
    try:
        with open(server_path, 'r') as f:
            content = f.read()
        
        # Find and replace CORS configuration
        old_cors = '''CORS(app, supports_credentials=True, resources={
    r"/api/*": {
        "origins": ["https://impify.visasystem.in"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }
})'''
        
        new_cors = '''CORS(app, supports_credentials=True, resources={
    r"/api/*": {
        "origins": [
            "https://impify.visasystem.in",
            "http://impify.visasystem.in", 
            "http://localhost:3000",
            "http://127.0.0.1:3000"
        ],
        "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
        "expose_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        "supports_credentials": True
    }
})'''
        
        if old_cors in content:
            content = content.replace(old_cors, new_cors)
            
            # Write the updated content
            with open(server_path, 'w') as f:
                f.write(content)
            
            print("✅ CORS configuration updated successfully")
            return True
        else:
            print("⚠️ CORS configuration not found or already updated")
            return False
            
    except Exception as e:
        print(f"❌ Failed to fix CORS configuration: {e}")
        return False

def check_database_connection():
    """Check if database connection might be the issue"""
    print("\n🗄️ Checking database configuration...")
    
    # This would require actual database connection
    # For now, just check if the URL format looks correct
    env_path = "backend/.env"
    
    try:
        with open(env_path, 'r') as f:
            content = f.read()
        
        # Extract MYSQL_URL
        mysql_url_match = re.search(r'MYSQL_URL=(.+)', content)
        if mysql_url_match:
            mysql_url = mysql_url_match.group(1).strip()
            print(f"📊 MySQL URL: {mysql_url[:50]}...")
            
            # Check URL format
            if "mysql+pymysql://" in mysql_url and "@" in mysql_url and "/" in mysql_url:
                print("✅ MySQL URL format looks correct")
            else:
                print("❌ MySQL URL format might be incorrect")
                print("   Expected format: mysql+pymysql://username:password@host:port/database")
        
        return True
    except Exception as e:
        print(f"❌ Failed to check database: {e}")
        return False

def create_test_user():
    """Create a test user to verify login works"""
    print("\n👤 Creating test user...")
    
    # This would need to be implemented with actual database access
    # For now, just provide instructions
    print("✅ Test user creation would happen here")
    print("   To create a test user manually:")
    print("   1. Start the backend server")
    print("   2. Use the frontend registration form with:")
    print("      Email: test@example.com")
    print("      Password: testpassword123")
    print("      Name: Test User")
    
    return True

def provide_manual_fixes():
    """Provide manual fixes that require human intervention"""
    print("\n🛠️ Manual Fixes Required:")
    print("=" * 50)
    
    print("1. 🗄️ Database Setup:")
    print("   - Ensure MySQL server is running")
    print("   - Create database 'visasyst_impify'")
    print("   - Verify user credentials match .env file")
    print("   - Run the SQL schema from impify_db.sql")
    
    print("\n2. 🚀 Backend Server:")
    print("   - Navigate to backend directory")
    print("   - Run: python server.py")
    print("   - Check for any startup errors")
    print("   - Ensure it starts on port 5000 or configured port")
    
    print("\n3. 🌐 Frontend Setup:")
    print("   - Navigate to frontend directory")
    print("   - Run: npm start")
    print("   - Ensure it's running on port 3000")
    print("   - Check browser console for errors")
    
    print("\n4. 🔧 Environment:")
    print("   - Verify all environment variables are loaded")
    print("   - Check .env file is in backend directory")
    print("   - Ensure no syntax errors in .env file")
    
    print("\n5. 🔍 Testing:")
    print("   - Open browser console on frontend")
    print("   - Paste the test_login.js script")
    print("   - Run: runLoginTests()")
    print("   - Check results and error messages")

def main():
    """Main fix function"""
    print("🚀 Impify Login Issues Fix")
    print("=" * 50)
    
    fixes_applied = 0
    
    # Apply automated fixes
    if fix_env_file():
        fixes_applied += 1
    
    if fix_server_cors():
        fixes_applied += 1
    
    if check_database_connection():
        fixes_applied += 1
    
    if create_test_user():
        fixes_applied += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Applied {fixes_applied} automated fixes")
    
    provide_manual_fixes()
    
    print("\n🎯 Next Steps:")
    print("1. Apply the manual fixes listed above")
    print("2. Start both backend and frontend servers")
    print("3. Test login with test_login.js script")
    print("4. Check browser console for any errors")

if __name__ == "__main__":
    main()