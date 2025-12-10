#!/usr/bin/env python3
"""
Simple authentication test for Impify
"""

import sys
import os
import json

# Add the current directory to Python path to import server modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from server import app, db, User
    from werkzeug.security import generate_password_hash, check_password_hash
    import uuid
    from datetime import datetime
    import pytz
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Trying to install missing dependencies...")
    os.system("pip install flask flask-cors flask-jwt-extended werkzeug flask-sqlalchemy python-dotenv pymysql pytz")
    try:
        from server import app, db, User
        from werkzeug.security import generate_password_hash, check_password_hash
        import uuid
        from datetime import datetime
        import pytz
    except ImportError as e2:
        print(f"❌ Still cannot import: {e2}")
        sys.exit(1)

def test_database_connection():
    """Test database connection"""
    print("🔌 Testing database connection...")
    try:
        with app.app_context():
            # Test basic database query
            user_count = User.query.count()
            print(f"✅ Database connection successful. Total users: {user_count}")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_user_creation():
    """Test creating a test user"""
    print("\n👤 Testing user creation...")
    try:
        with app.app_context():
            test_email = "test@example.com"
            
            # Check if user already exists
            existing_user = User.query.filter_by(email=test_email).first()
            if existing_user:
                print(f"✅ Test user already exists: {test_email}")
                return existing_user
            
            # Create new test user
            test_password = "testpassword123"
            hashed_password = generate_password_hash(test_password)
            
            user = User(
                id=str(uuid.uuid4()),
                email=test_email,
                name="Test User",
                password=hashed_password,
                created_at=datetime.now(pytz.timezone('Asia/Kolkata'))
            )
            
            db.session.add(user)
            db.session.commit()
            
            print(f"✅ Test user created: {test_email}")
            return user
    except Exception as e:
        print(f"❌ User creation failed: {e}")
        db.session.rollback()
        return None

def test_password_hashing():
    """Test password hashing functionality"""
    print("\n🔐 Testing password hashing...")
    try:
        test_password = "testpassword123"
        
        # Test hash generation
        hashed = generate_password_hash(test_password)
        print(f"✅ Hash generated: {hashed[:50]}...")
        
        # Test verification
        is_valid = check_password_hash(hashed, test_password)
        if is_valid:
            print("✅ Password verification successful")
            return True
        else:
            print("❌ Password verification failed")
            return False
    except Exception as e:
        print(f"❌ Password hashing test failed: {e}")
        return False

def test_login_endpoint():
    """Test the login endpoint directly"""
    print("\n🔑 Testing login endpoint...")
    try:
        with app.test_client() as client:
            # Test data
            test_email = "test@example.com"
            test_password = "testpassword123"
            
            # Try login
            response = client.post('/api/auth/login', 
                json={
                    'email': test_email,
                    'password': test_password
                },
                content_type='application/json'
            )
            
            print(f"📡 Login response status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.get_json()
                print("✅ Login successful!")
                print(f"   User ID: {data.get('user', {}).get('id', 'Unknown')}")
                print(f"   Email: {data.get('user', {}).get('email', 'Unknown')}")
                print(f"   Role: {data.get('user', {}).get('role', 'Unknown')}")
                if data.get('token'):
                    print(f"   Token: {data['token'][:50]}...")
                return True
            else:
                print(f"❌ Login failed: {response.status_code}")
                error_data = response.get_json() if response.is_json else response.data
                print(f"   Error: {error_data}")
                return False
    except Exception as e:
        print(f"❌ Login endpoint test failed: {e}")
        return False

def test_registration_endpoint():
    """Test the registration endpoint"""
    print("\n📝 Testing registration endpoint...")
    try:
        with app.test_client() as client:
            # Test data
            test_email = "newuser@example.com"
            test_password = "newpassword123"
            test_name = "New Test User"
            
            # Try registration
            response = client.post('/api/auth/register', 
                json={
                    'email': test_email,
                    'password': test_password,
                    'name': test_name
                },
                content_type='application/json'
            )
            
            print(f"📡 Registration response status: {response.status_code}")
            
            if response.status_code == 201:
                data = response.get_json()
                print("✅ Registration successful!")
                print(f"   User ID: {data.get('user', {}).get('id', 'Unknown')}")
                print(f"   Email: {data.get('user', {}).get('email', 'Unknown')}")
                return True
            elif response.status_code == 400:
                if "already exists" in str(response.get_json()).lower():
                    print("⚠️ User already exists (this is OK for testing)")
                    return True
                else:
                    print(f"❌ Registration failed: {response.get_json()}")
                    return False
            else:
                print(f"❌ Registration failed: {response.status_code}")
                error_data = response.get_json() if response.is_json else response.data
                print(f"   Error: {error_data}")
                return False
    except Exception as e:
        print(f"❌ Registration endpoint test failed: {e}")
        return False

def main():
    """Main diagnostic function"""
    print("🚀 Impify Authentication Diagnostic")
    print("=" * 50)
    
    # Test results
    results = {}
    
    # Run all tests
    results["database"] = test_database_connection()
    if not results["database"]:
        print("\n❌ Cannot proceed without database connection")
        return
    
    results["password_hashing"] = test_password_hashing()
    
    # Create test user
    test_user = test_user_creation()
    if not test_user:
        print("\n❌ Cannot proceed without test user")
        return
    
    results["registration"] = test_registration_endpoint()
    results["login"] = test_login_endpoint()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 DIAGNOSTIC SUMMARY")
    print("=" * 50)
    
    passed = sum(results.values())
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title():.<30} {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Authentication should work correctly.")
        print("\n💡 Next steps:")
        print("1. Start the Flask server: python server.py")
        print("2. Test login through the frontend")
        print("3. Check browser console for any frontend errors")
    else:
        print(f"\n⚠️ {total - passed} test(s) failed. Check the issues above.")
        print("\n🛠️ Common solutions:")
        print("1. Check database connection and credentials")
        print("2. Verify environment variables are loaded")
        print("3. Ensure all required dependencies are installed")
        print("4. Check Flask server is running on correct port")

if __name__ == "__main__":
    main()