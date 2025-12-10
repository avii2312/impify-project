#!/usr/bin/env python3
"""
Login Diagnostics Script for Impify
This script helps identify and fix common login issues.
"""

import requests
import json
import os
from werkzeug.security import generate_password_hash, check_password_hash

# Configuration
BASE_URL = "https://impify.visasystem.in"
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "testpassword123"

def test_backend_connection():
    """Test if the backend server is accessible"""
    print("🔍 Testing backend connection...")
    try:
        response = requests.get(f"{BASE_URL}/api/", timeout=10)
        if response.status_code == 200:
            print("✅ Backend server is accessible")
            return True
        else:
            print(f"❌ Backend returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False

def test_health_endpoint():
    """Test the health check endpoint"""
    print("\n🏥 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_registration():
    """Test user registration functionality"""
    print(f"\n📝 Testing registration with {TEST_EMAIL}...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD,
                "name": "Test User"
            },
            timeout=10
        )
        
        if response.status_code == 201:
            print("✅ Registration successful")
            return True
        elif response.status_code == 400:
            if "already exists" in response.json().get("error", ""):
                print("⚠️ User already exists (this is OK for testing)")
                return True
            else:
                print(f"❌ Registration failed: {response.json()}")
                return False
        else:
            print(f"❌ Registration error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Registration exception: {e}")
        return False

def test_login():
    """Test login functionality"""
    print(f"\n🔐 Testing login with {TEST_EMAIL}...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful!")
            print(f"   User ID: {data.get('user', {}).get('id', 'Unknown')}")
            print(f"   Email: {data.get('user', {}).get('email', 'Unknown')}")
            print(f"   Role: {data.get('user', {}).get('role', 'Unknown')}")
            if data.get('token'):
                print(f"   Token: {data['token'][:50]}...")
            return True
        else:
            print(f"❌ Login failed: {response.status_code}")
            error_data = response.json() if response.headers.get('content-type') == 'application/json' else response.text
            print(f"   Error: {error_data}")
            return False
    except Exception as e:
        print(f"❌ Login exception: {e}")
        return False

def test_password_hashing():
    """Test password hashing functionality"""
    print("\n🔐 Testing password hashing...")
    try:
        # Test hash generation
        hash_result = generate_password_hash(TEST_PASSWORD)
        print(f"✅ Hash generated: {hash_result[:50]}...")
        
        # Test hash verification
        verification_result = check_password_hash(hash_result, TEST_PASSWORD)
        if verification_result:
            print("✅ Password verification works")
            return True
        else:
            print("❌ Password verification failed")
            return False
    except Exception as e:
        print(f"❌ Password hashing error: {e}")
        return False

def test_admin_login():
    """Test admin login (if admin user exists)"""
    print("\n👑 Testing admin login...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/admin/auth/login",
            json={
                "email": "admin@gmail.com",
                "password": "admin123"
            },
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Admin login successful")
            return True
        elif response.status_code == 403:
            print("⚠️ Admin access denied (this is normal if admin doesn't exist)")
            return True
        else:
            print(f"❌ Admin login failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Admin login exception: {e}")
        return False

def provide_solutions():
    """Provide solutions for common issues"""
    print("\n🛠️ Common Login Issues and Solutions:")
    print("\n1. Backend Not Running:")
    print("   - Ensure the Flask server is running on the backend")
    print("   - Check that the database connection is working")
    print("   - Verify environment variables are loaded")
    
    print("\n2. Database Connection Issues:")
    print("   - Check MySQL database is running")
    print("   - Verify database credentials in .env file")
    print("   - Ensure database 'visasyst_impify' exists")
    
    print("\n3. JWT Issues:")
    print("   - Use a secure JWT secret key (not default)")
    print("   - Ensure JWT_SECRET_KEY is set in environment")
    print("   - Check token expiration settings")
    
    print("\n4. CORS Issues:")
    print("   - Verify CORS_ORIGINS includes your frontend domain")
    print("   - Check that frontend is making requests to correct backend URL")
    
    print("\n5. User Account Issues:")
    print("   - Ensure user registration works first")
    print("   - Check that password hashing/verification is consistent")
    print("   - Verify user stats and subscription records are created")

def main():
    """Main diagnostic function"""
    print("🚀 Impify Login Diagnostics")
    print("=" * 50)
    
    # Run all tests
    results = {
        "backend_connection": test_backend_connection(),
        "health_check": test_health_endpoint(),
        "password_hashing": test_password_hashing(),
        "registration": test_registration(),
        "login": test_login(),
        "admin_login": test_admin_login()
    }
    
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
        print("\n🎉 All tests passed! Login should work correctly.")
    else:
        print(f"\n⚠️ {total - passed} test(s) failed. Check the issues above.")
    
    provide_solutions()

if __name__ == "__main__":
    main()