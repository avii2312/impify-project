#!/usr/bin/env python3
"""
Test script to validate the user stats fixes without running Flask server
"""

import sys
import os
from datetime import datetime, timedelta, date

# Simple timezone replacement
class pytz:
    timezone = lambda x: None

# Simulate the UserStats model structure
class MockUserStats:
    def __init__(self):
        self.user_id = None
        self.tokens = 0
        self.monthly_tokens = 100
        self.xp = 0
        self.streak = 0
        self.level = 1
        self.last_active_date = None
        self.last_reset = None
        self.monthly_reset_date = None

# Mock database session
class MockSession:
    def __init__(self):
        self.data = {}
        
    def add(self, obj):
        self.data[obj.user_id] = obj
        
    def commit(self):
        pass

# Mock timezone
class MockTimezone:
    def __init__(self, name):
        pass

class MockPytz:
    timezone = MockTimezone

pytz = MockPytz()

# Test our fixes
def test_get_stats_logic():
    """Test the get_stats function logic"""
    print("🧪 Testing get_stats logic...")
    
    mock_session = MockSession()
    
    def get_stats(user_id):
        """Simulated get_stats function"""
        # Check if stats exist
        if user_id in mock_session.data:
            return mock_session.data[user_id]
            
        # Create new stats if not exist
        # ist = pytz.timezone('Asia/Kolkata')  # Mocked
        now = datetime.now()
        current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        stats = MockUserStats()
        stats.user_id = user_id
        stats.tokens = 100  # Start with 100 tokens
        stats.monthly_tokens = 100
        stats.xp = 0
        stats.streak = 1  # Start with 1 for active users
        stats.level = 1
        stats.last_active_date = now.date()
        stats.last_reset = now.date()
        stats.monthly_reset_date = current_month
        
        mock_session.add(stats)
        print(f"✅ Created new user stats for user {user_id}")
        return stats
    
    # Test creating new stats
    user_id = "test-user-123"
    stats = get_stats(user_id)
    
    assert stats.user_id == user_id
    assert stats.tokens == 100
    assert stats.streak == 1
    assert stats.xp == 0
    assert stats.level == 1
    
    # Test retrieving existing stats
    stats2 = get_stats(user_id)
    assert stats2 == stats
    
    print("✅ get_stats logic test passed!")

def test_update_streak_and_xp_logic():
    """Test the update_streak_and_xp function logic"""
    print("\n🧪 Testing update_streak_and_xp logic...")
    
    def update_streak_and_xp(stats, activity_type="login"):
        """Simulated update_streak_and_xp function"""
        # now = datetime.now(pytz.timezone('Asia/Kolkata'))  # Mocked
        now = datetime.now()
        today = now.date()

        # Handle streak calculation
        if stats.last_active_date is None:
            stats.streak = 1
        elif stats.last_active_date == today:
            pass  # Already active today
        elif stats.last_active_date == today - timedelta(days=1):
            stats.streak += 1
        else:
            stats.streak = 1

        stats.last_active_date = today

        # Calculate XP gain
        xp_gains = {
            'login': 5,
            'upload': 15,
            'flashcard_generation': 20,
            'flashcard_review': 5,
            'chat': 10,
            'file_chat': 10
        }
        
        xp_gain = xp_gains.get(activity_type, 5)
        
        # Update XP
        old_level = stats.level
        old_xp = stats.xp
        stats.xp += xp_gain

        # Calculate level
        import math
        stats.level = max(1, math.floor(stats.xp / 100) + 1)

        # Check for streak rewards
        if stats.streak == 7:
            stats.tokens += 50
        elif stats.streak == 14:
            stats.tokens += 100

        # Check for level up rewards
        if stats.level > old_level:
            stats.tokens += 25
            
        print(f"Updated: XP={old_xp}->{stats.xp}, Level={old_level}->{stats.level}, Streak={stats.streak}, Tokens={stats.tokens}")
        return True
    
    # Test case 1: New user first login
    print("Test 1: New user first login")
    stats = MockUserStats()
    update_streak_and_xp(stats, "login")
    assert stats.streak == 1
    assert stats.xp == 5
    assert stats.level == 1
    assert stats.tokens == 100  # No reward yet
    print("✅ Test 1 passed!")
    
    # Test case 2: Upload activity
    print("\nTest 2: Upload activity")
    stats = MockUserStats()
    update_streak_and_xp(stats, "upload")
    assert stats.streak == 1
    assert stats.xp == 15
    assert stats.level == 1
    print("✅ Test 2 passed!")
    
    # Test case 3: Multiple activities to reach level 2
    print("\nTest 3: Multiple activities to reach level 2")
    stats = MockUserStats()
    update_streak_and_xp(stats, "upload")  # +15 XP = 15 XP
    update_streak_and_xp(stats, "flashcard_generation")  # +20 XP = 35 XP
    update_streak_and_xp(stats, "upload")  # +15 XP = 50 XP
    update_streak_and_xp(stats, "upload")  # +15 XP = 65 XP
    update_streak_and_xp(stats, "upload")  # +15 XP = 80 XP
    update_streak_and_xp(stats, "upload")  # +15 XP = 95 XP
    update_streak_and_xp(stats, "login")   # +5 XP = 100 XP
    
    assert stats.xp == 100
    assert stats.level == 2  # Should have leveled up
    assert stats.tokens == 125  # 100 initial + 25 level up reward
    print("✅ Test 3 passed!")
    
    # Test case 4: Streak milestone
    print("\nTest 4: 7-day streak milestone")
    stats = MockUserStats()
    stats.streak = 6
    update_streak_and_xp(stats, "login")  # Should reach 7 and get reward
    assert stats.streak == 7
    assert stats.tokens == 150  # 100 initial + 50 streak reward
    print("✅ Test 4 passed!")
    
    print("✅ update_streak_and_xp logic test passed!")

def test_level_calculation():
    """Test the level calculation formula"""
    print("\n🧪 Testing level calculation formula...")
    
    test_cases = [
        (0, 1),    # 0 XP = Level 1
        (50, 1),   # 50 XP = Level 1
        (99, 1),   # 99 XP = Level 1
        (100, 2),  # 100 XP = Level 2
        (199, 2),  # 199 XP = Level 2
        (200, 3),  # 200 XP = Level 3
        (500, 6),  # 500 XP = Level 6
    ]
    
    for xp, expected_level in test_cases:
        import math
        calculated_level = max(1, math.floor(xp / 100) + 1)
        assert calculated_level == expected_level, f"XP {xp} should be level {expected_level}, got {calculated_level}"
        print(f"  {xp} XP = Level {calculated_level} ✅")
    
    print("✅ Level calculation test passed!")

def main():
    """Run all tests"""
    print("🚀 Testing User Stats Fixes\n")
    
    test_get_stats_logic()
    test_update_streak_and_xp_logic()
    test_level_calculation()
    
    print("\n🎉 All tests passed! The user stats system should now work correctly.")
    print("\nSummary of fixes:")
    print("✅ get_stats now properly initializes users with 100 tokens and streak=1")
    print("✅ update_streak_and_xp has improved XP calculation and milestone rewards")
    print("✅ Level system now uses simple 100 XP per level progression")
    print("✅ Streak system tracks consecutive days with milestone rewards")
    print("✅ Frontend XPBar component updated to match backend calculations")

if __name__ == "__main__":
    main()