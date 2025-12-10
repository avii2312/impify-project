#!/usr/bin/env python3
"""
Test script to verify the login timeout fix
This tests the optimized login flow to ensure it's working properly.
"""

import requests
import time
import json

# Test configuration
BASE_URL = "http://localhost:5000/api"
TEST_EMAIL = "test@example.com"  # Replace with actual test user
TEST_PASSWORD = "testpassword123"  # Replace with actual test password

def test_login_speed():
    """Test login speed after optimization"""
    print("🚀 Testing login speed optimization...")
    
    login_data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    
    start_time = time.time()
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login", 
            json=login_data,
            timeout=10  # 10 second timeout
        )
        
        end_time = time.time()
        duration = end_time - start_time
        
        print(f"⏱️  Login response time: {duration:.2f} seconds")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            print(f"📊 Status Code: {response.status_code}")
            
            # Check if we got a token
            data = response.json()
            if "token" in data:
                print("✅ Token received successfully")
                print(f"👤 User: {data.get('user', {}).get('email', 'Unknown')}")
            else:
                print("⚠️  No token in response")
                
            if duration > 5:
                print(f"⚠️  Login took {duration:.2f}s - still slower than expected")
            else:
                print(f"🎉 Login speed is good: {duration:.2f}s")
                
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"Error: {response.text}")
            
    except requests.exceptions.Timeout:
        print("❌ Login timed out after 10 seconds")
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - is the backend running?")
    except Exception as e:
        print(f"❌ Login test failed: {str(e)}")

def test_background_setup():
    """Test if background user setup is working"""
    print("\n🔧 Testing background user setup...")
    
    # This test requires a successful login first
    try:
        login_response = requests.post(
            f"{BASE_URL}/auth/login", 
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            timeout=5
        )
        
        if login_response.status_code == 200:
            token = login_response.json().get("token")
            
            # Test user stats endpoint
            headers = {"Authorization": f"Bearer {token}"}
            stats_response = requests.get(
                f"{BASE_URL}/user/token-info",
                headers=headers,
                timeout=5
            )
            
            if stats_response.status_code == 200:
                print("✅ User stats setup working")
                print(f"📊 Token info: {stats_response.json()}")
            else:
                print(f"⚠️  User stats endpoint failed: {stats_response.status_code}")
        else:
            print("⚠️  Cannot test background setup without successful login")
            
    except Exception as e:
        print(f"❌ Background setup test failed: {str(e)}")

if __name__ == "__main__":
    print("=" * 60)
    print("🔍 LOGIN TIMEOUT FIX TEST")
    print("=" * 60)
    
    test_login_speed()
    test_background_setup()
    
    print("\n" + "=" * 60)
    print("✅ Test completed!")
    print("=" * 60)