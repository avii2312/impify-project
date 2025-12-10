#!/usr/bin/env python3
"""
Comprehensive Test Script for Flashcard System
Tests all components: backend API, AI generation, spaced repetition, and frontend integration
"""

import requests
import json
import time
import random
from datetime import datetime, timedelta

# Test Configuration
BASE_URL = "http://localhost:5000/api"
TEST_USER = {
    "email": "test@example.com",
    "password": "test123456",
    "name": "Test User"
}

# Store test tokens and IDs
auth_token = None
user_id = None
note_id = None
flashcard_ids = []

def print_test_header(test_name):
    """Print formatted test header"""
    print(f"\n{'='*60}")
    print(f"🧪 TESTING: {test_name}")
    print(f"{'='*60}")

def print_success(message):
    """Print success message"""
    print(f"✅ {message}")

def print_error(message):
    """Print error message"""
    print(f"❌ {message}")

def print_info(message):
    """Print info message"""
    print(f"ℹ️ {message}")

def test_health_check():
    """Test 1: Health Check"""
    print_test_header("Health Check")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print_success("Backend API is running")
            print_info(f"Response: {response.json()}")
            return True
        else:
            print_error(f"Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Health check error: {e}")
        return False

def test_user_registration():
    """Test 2: User Registration"""
    print_test_header("User Registration")
    global auth_token, user_id
    
    try:
        # Register user
        response = requests.post(f"{BASE_URL}/auth/register", json=TEST_USER)
        
        if response.status_code == 201:
            data = response.json()
            auth_token = data.get('token')
            user_id = data.get('user', {}).get('id')
            print_success("User registered successfully")
            print_info(f"User ID: {user_id}")
            return True
        elif response.status_code == 400 and "already exists" in response.json().get('error', ''):
            print_info("User already exists, attempting login...")
            return test_user_login()
        else:
            print_error(f"Registration failed: {response.status_code}")
            print_info(f"Response: {response.json()}")
            return False
    except Exception as e:
        print_error(f"Registration error: {e}")
        return False

def test_user_login():
    """Test 3: User Login"""
    print_test_header("User Login")
    global auth_token, user_id
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        
        if response.status_code == 200:
            data = response.json()
            auth_token = data.get('token')
            user_id = data.get('user', {}).get('id')
            print_success("User logged in successfully")
            print_info(f"User ID: {user_id}")
            return True
        else:
            print_error(f"Login failed: {response.status_code}")
            print_info(f"Response: {response.json()}")
            return False
    except Exception as e:
        print_error(f"Login error: {e}")
        return False

def test_flashcard_api():
    """Test 4: Flashcard API Endpoints"""
    print_test_header("Flashcard API Endpoints")
    global flashcard_ids
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # Test getting flashcards (should be empty initially)
    try:
        response = requests.get(f"{BASE_URL}/flashcards", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print_success(f"Get flashcards API works: {len(data.get('flashcards', []))} cards")
        else:
            print_error(f"Get flashcards failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Get flashcards error: {e}")
        return False
    
    # Test getting due flashcards (should be empty initially)
    try:
        response = requests.get(f"{BASE_URL}/flashcards/due", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print_success(f"Get due flashcards API works: {len(data.get('flashcards', []))} due cards")
        else:
            print_error(f"Get due flashcards failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Get due flashcards error: {e}")
        return False
    
    return True

def test_ai_flashcard_generation():
    """Test 5: AI Flashcard Generation"""
    print_test_header("AI Flashcard Generation")
    global note_id, flashcard_ids
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # First, create a test note
    try:
        note_data = {
            "user_id": user_id,
            "title": "Test Biology Notes",
            "content": """
            Photosynthesis is the process by which plants convert sunlight into chemical energy. 
            It occurs in the chloroplasts and requires carbon dioxide, water, and light. 
            The main stages are light-dependent reactions and light-independent reactions (Calvin cycle). 
            Chlorophyll absorbs light energy, which is used to split water molecules and release oxygen. 
            The glucose produced is used for plant metabolism and growth.
            """,
            "note_type": "general"
        }
        
        # Create note via database
        from backend.server import db, Note
        note = Note(
            id="test-note-123",
            user_id=user_id,
            title=note_data["title"],
            content=note_data["content"],
            note_type=note_data["note_type"],
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(note)
        db.session.commit()
        note_id = note.id
        print_success(f"Test note created: {note_id}")
        
    except Exception as e:
        print_error(f"Failed to create test note: {e}")
        return False
    
    # Test AI flashcard generation
    try:
        response = requests.post(
            f"{BASE_URL}/flashcards/generate",
            headers=headers,
            json={"note_id": note_id, "num_cards": 5}
        )
        
        if response.status_code == 200:
            data = response.json()
            flashcards = data.get('flashcards', [])
            flashcard_ids = [card['id'] for card in flashcards]
            print_success(f"AI generated {len(flashcards)} flashcards")
            
            # Display first flashcard as example
            if flashcards:
                first_card = flashcards[0]
                print_info(f"Sample card - Q: {first_card.get('question', '')[:50]}...")
                print_info(f"           A: {first_card.get('answer', '')[:50]}...")
            
            return True
        else:
            print_error(f"AI flashcard generation failed: {response.status_code}")
            print_info(f"Response: {response.json()}")
            return False
    except Exception as e:
        print_error(f"AI generation error: {e}")
        return False

def test_spaced_repetition():
    """Test 6: Spaced Repetition Algorithm"""
    print_test_header("Spaced Repetition Algorithm")
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    if not flashcard_ids:
        print_error("No flashcards available for testing")
        return False
    
    try:
        # Test reviewing a flashcard
        flashcard_id = flashcard_ids[0]
        
        # Test correct review
        response = requests.patch(
            f"{BASE_URL}/flashcards/{flashcard_id}/review",
            headers=headers,
            json={"was_correct": True}
        )
        
        if response.status_code == 200:
            data = response.json()
            card = data.get('flashcard', {})
            next_review = card.get('next_review_date')
            interval = card.get('interval_days')
            print_success(f"Correct review processed")
            print_info(f"Next review: {next_review}")
            print_info(f"Interval: {interval} days")
        else:
            print_error(f"Review failed: {response.status_code}")
            return False
        
        # Test incorrect review
        if len(flashcard_ids) > 1:
            flashcard_id2 = flashcard_ids[1]
            response = requests.patch(
                f"{BASE_URL}/flashcards/{flashcard_id2}/review",
                headers=headers,
                json={"was_correct": False}
            )
            
            if response.status_code == 200:
                data = response.json()
                card = data.get('flashcard', {})
                interval = card.get('interval_days')
                print_success(f"Incorrect review processed (interval: {interval} days)")
            else:
                print_error(f"Incorrect review failed: {response.status_code}")
                return False
        
        return True
    except Exception as e:
        print_error(f"Spaced repetition test error: {e}")
        return False

def test_due_cards_after_review():
    """Test 7: Due Cards After Review"""
    print_test_header("Due Cards After Review")
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/flashcards/due", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            due_cards = data.get('flashcards', [])
            print_success(f"Due cards retrieved: {len(due_cards)}")
            
            if due_cards:
                print_info("Sample due card:")
                for card in due_cards[:2]:  # Show first 2 cards
                    print_info(f"  Q: {card.get('question', '')[:60]}...")
                    print_info(f"  A: {card.get('answer', '')[:60]}...")
            
            return True
        else:
            print_error(f"Get due cards failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Due cards test error: {e}")
        return False

def test_flashcard_crud():
    """Test 8: Flashcard CRUD Operations"""
    print_test_header("Flashcard CRUD Operations")
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    if not flashcard_ids:
        print_error("No flashcards available for testing")
        return False
    
    flashcard_id = flashcard_ids[0]
    
    # Test getting specific flashcard
    try:
        response = requests.get(f"{BASE_URL}/flashcards/{flashcard_id}", headers=headers)
        if response.status_code == 200:
            print_success(f"Get flashcard {flashcard_id} successful")
        else:
            print_error(f"Get flashcard failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Get flashcard error: {e}")
        return False
    
    # Test deleting flashcard
    try:
        response = requests.delete(f"{BASE_URL}/flashcards/{flashcard_id}", headers=headers)
        if response.status_code == 200:
            print_success(f"Delete flashcard {flashcard_id} successful")
            flashcard_ids.remove(flashcard_id)
        else:
            print_error(f"Delete flashcard failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Delete flashcard error: {e}")
        return False
    
    return True

def test_database_schema():
    """Test 9: Database Schema"""
    print_test_header("Database Schema")
    
    try:
        from backend.server import Flashcard
        
        # Check if Flashcard model has required fields
        required_fields = ['id', 'user_id', 'note_id', 'question', 'answer', 
                          'ease_factor', 'interval_days', 'review_count', 
                          'correct_count', 'next_review_date', 'is_new', 'created_at']
        
        flashcard_columns = [column.name for column in Flashcard.__table__.columns]
        
        missing_fields = [field for field in required_fields if field not in flashcard_columns]
        
        if not missing_fields:
            print_success("All required fields present in Flashcard model")
        else:
            print_error(f"Missing fields in Flashcard model: {missing_fields}")
            return False
        
        # Check current flashcard count
        count = Flashcard.query.count()
        print_info(f"Total flashcards in database: {count}")
        
        return True
    except Exception as e:
        print_error(f"Database schema test error: {e}")
        return False

def cleanup_test_data():
    """Clean up test data"""
    print_test_header("Cleanup Test Data")
    
    try:
        from backend.server import db, Note, Flashcard
        
        # Delete test note
        if note_id:
            note = Note.query.filter_by(id=note_id).first()
            if note:
                db.session.delete(note)
                print_success("Test note deleted")
        
        # Delete test flashcards
        if flashcard_ids:
            Flashcard.query.filter(Flashcard.id.in_(flashcard_ids)).delete()
            print_success("Test flashcards deleted")
        
        db.session.commit()
        print_success("Cleanup completed")
        return True
    except Exception as e:
        print_error(f"Cleanup error: {e}")
        return False

def run_comprehensive_tests():
    """Run all tests"""
    print("🚀 Starting Comprehensive Flashcard System Test Suite")
    print(f"📅 Test started at: {datetime.now()}")
    
    # Initialize Flask app for database access
    import sys
    import os
    sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
    
    from backend.server import app, db
    with app.app_context():
        # Test sequence
        tests = [
            ("Health Check", test_health_check),
            ("User Registration", test_user_registration),
            ("User Login", test_user_login),
            ("Flashcard API", test_flashcard_api),
            ("AI Generation", test_ai_flashcard_generation),
            ("Spaced Repetition", test_spaced_repetition),
            ("Due Cards", test_due_cards_after_review),
            ("CRUD Operations", test_flashcard_crud),
            ("Database Schema", test_database_schema),
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed += 1
                time.sleep(1)  # Small delay between tests
            except Exception as e:
                print_error(f"Test {test_name} crashed: {e}")
        
        # Cleanup
        cleanup_test_data()
        
        # Results
        print(f"\n{'='*60}")
        print(f"📊 TEST RESULTS")
        print(f"{'='*60}")
        print(f"✅ Passed: {passed}/{total}")
        print(f"❌ Failed: {total - passed}/{total}")
        print(f"📈 Success Rate: {(passed/total)*100:.1f}%")
        
        if passed == total:
            print("🎉 ALL TESTS PASSED! Flashcard system is working correctly!")
        else:
            print("⚠️ Some tests failed. Please check the errors above.")
        
        print(f"📅 Test completed at: {datetime.now()}")

if __name__ == "__main__":
    run_comprehensive_tests()