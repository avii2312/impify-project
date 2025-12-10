from datetime import date
import uuid
from server import db, UserStats

def get_stats(user_id):
    stats = UserStats.query.get(user_id)
    if not stats:
        stats = UserStats(user_id=user_id, tokens=200)
        db.session.add(stats)
        db.session.commit()
    return stats

def add_tokens(user_id, amount):
    stats = get_stats(user_id)
    stats.tokens += amount
    db.session.commit()
    return stats.tokens

def spend_tokens(user_id, amount):
    stats = get_stats(user_id)
    if stats.tokens < amount:
        return False
    stats.tokens -= amount
    db.session.commit()
    return True

def add_xp(user_id, amount):
    stats = get_stats(user_id)
    stats.xp += amount
    stats.level = int((stats.xp / 10) ** 0.5)
    db.session.commit()
    return stats.level

def daily_reset(user_id):
    today = date.today()
    stats = get_stats(user_id)

    if stats.last_reset != today:
        stats.tokens = min(stats.tokens + 50, 300)
        stats.streak += 1
        stats.last_reset = today
        db.session.commit()

def can_upload_file(user_id):
    from server import UserDailyUploads
    today = date.today()
    record = UserDailyUploads.query.filter_by(user_id=user_id, upload_date=today).first()

    if not record:
        record = UserDailyUploads(
            id=str(uuid.uuid4()),
            user_id=user_id,
            upload_date=today,
            uploads_count=0
        )
        db.session.add(record)
        db.session.commit()

    # Free tier limit = 5 uploads / day
    if record.uploads_count >= 5:
        return False

    record.uploads_count += 1
    db.session.commit()
    return True