import uuid
from datetime import datetime, timedelta, date

def ensure_user_stats(user_id):
    """Safe user stats creation - handles database errors gracefully"""
    try:
        # Import at function level to avoid circular dependency
        from server import db, UserStats
        import pytz
        
        # Check if stats already exist
        stats = UserStats.query.filter_by(user_id=user_id).first()
        if stats:
            return stats
            
        # Create new stats only if they don't exist
        ist = pytz.timezone('Asia/Kolkata')
        now = datetime.now(ist)
        
        stats = UserStats(
            user_id=user_id,
            tokens=100,
            monthly_tokens=100,
            xp=0,
            streak=0,  # Will be updated to 1 on first login
            level=1,
            last_active_date=now.date(),
            monthly_reset_date=now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        )
        
        # Add to session but don't commit yet (caller will handle commit)
        db.session.add(stats)
        return stats
        
    except ImportError as e:
        print(f"Import error in ensure_user_stats: {e}")
        return None
    except Exception as e:
        print(f"Error ensuring user stats for {user_id}: {e}")
        try:
            db.session.rollback()
        except:
            pass
        return None

def ensure_user_subscription(user_id):
    """Safe subscription creation - handles database errors gracefully"""
    try:
        # Import at function level to avoid circular dependency
        from server import db, Subscription
        
        # Check if subscription already exists
        sub = Subscription.query.filter_by(user_id=user_id).first()
        if sub:
            return sub
            
        # Create new subscription only if it doesn't exist
        import pytz
        ist = pytz.timezone('Asia/Kolkata')
        now = datetime.now(ist)
        
        sub = Subscription(
            id=str(uuid.uuid4()),
            user_id=user_id,
            tier='free',
            active=True,
            created_at=now,
            expires_at=None
        )
        
        # Add to session but don't commit yet (caller will handle commit)
        db.session.add(sub)
        return sub
        
    except ImportError as e:
        print(f"Import error in ensure_user_subscription: {e}")
        return None
    except Exception as e:
        print(f"Error ensuring user subscription for {user_id}: {e}")
        try:
            db.session.rollback()
        except:
            pass
        return None