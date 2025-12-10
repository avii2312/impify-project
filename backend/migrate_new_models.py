#!/usr/bin/env python3
"""
Migration script to add new database models for Impify.
Run this script to create the new tables in the database.
"""

import os
import sys
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

# Add the current directory to the path so we can import server.py
sys.path.insert(0, os.path.dirname(__file__))

# Load environment variables
load_dotenv()

# Import the models from server.py
from server import (
    UserStats, UserDailyUploads, Subscription, Referral, GlobalSettings, ChatLog,
    Flashcard, SupportTicket, CommunityPost, CommunityLike, Notification
)

def create_app():
    """Create Flask app with database configuration"""
    app = Flask(__name__)

    # Database configuration
    mysql_url = os.environ.get('MYSQL_URL', 'mysql+pymysql://visasyst:FLLq37d)s9B:d6@localhost:3306/visasyst_impify')
    app.config['SQLALCHEMY_DATABASE_URI'] = mysql_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize SQLAlchemy
    db = SQLAlchemy(app)

    return app, db

def run_migration():
    """Run the database migration"""
    print("🚀 Starting database migration for new models...")

    app, db = create_app()

    with app.app_context():
        try:
            print("📋 Creating tables for new models...")

            # Create tables for new models
            print("  - Creating user_stats table...")
            UserStats.__table__.create(db.engine, checkfirst=True)

            print("  - Creating user_daily_uploads table...")
            UserDailyUploads.__table__.create(db.engine, checkfirst=True)

            print("  - Creating subscriptions table...")
            Subscription.__table__.create(db.engine, checkfirst=True)

            print("  - Creating referrals table...")
            Referral.__table__.create(db.engine, checkfirst=True)

            print("  - Creating global_settings table...")
            GlobalSettings.__table__.create(db.engine, checkfirst=True)

            print("  - Creating chat_logs table...")
            ChatLog.__table__.create(db.engine, checkfirst=True)

            # Create tables for existing models that might be missing
            print("  - Creating flashcards table...")
            Flashcard.__table__.create(db.engine, checkfirst=True)

            print("  - Creating support_tickets table...")
            SupportTicket.__table__.create(db.engine, checkfirst=True)

            print("  - Creating community_posts table...")
            CommunityPost.__table__.create(db.engine, checkfirst=True)

            print("  - Creating community_likes table...")
            CommunityLike.__table__.create(db.engine, checkfirst=True)

            print("  - Creating notifications table...")
            Notification.__table__.create(db.engine, checkfirst=True)

            # Insert default global settings if not exists
            print("📝 Inserting default global settings...")
            existing_settings = GlobalSettings.query.first()
            if not existing_settings:
                default_settings = GlobalSettings(
                    id=1,
                    free_uploads_per_day=5,
                    free_chats_per_day=10,
                    daily_token_cap=200,
                    streak_bonus_base=10
                )
                db.session.add(default_settings)
                db.session.commit()
                print("  ✅ Default global settings inserted")
            else:
                print("  ℹ️  Global settings already exist")

            print("✅ Migration completed successfully!")
            print("\n📋 Summary of added tables:")
            print("  - user_stats")
            print("  - user_daily_uploads")
            print("  - subscriptions")
            print("  - referrals")
            print("  - global_settings")
            print("  - chat_logs")
            print("  - flashcards")
            print("  - support_tickets")
            print("  - community_posts")
            print("  - community_likes")
            print("  - notifications")

        except Exception as e:
            print(f"❌ Migration failed: {e}")
            import traceback
            traceback.print_exc()
            db.session.rollback()
            return False

    return True

if __name__ == "__main__":
    success = run_migration()
    if success:
        print("\n🎉 All new models have been successfully added to the database!")
        print("You can now use the new features in your application.")
    else:
        print("\n💥 Migration failed. Please check the error messages above.")
        sys.exit(1)