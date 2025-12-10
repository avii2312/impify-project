#!/usr/bin/env python3
"""
Migration script to add folders table to the database.
Run this script to add the folders functionality to an existing database.
"""

import os
import sys
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import pymysql

# Load environment variables
load_dotenv()

# Database configuration
mysql_url = os.environ.get('MYSQL_URL', 'mysql+pymysql://visasyst:FLLq37d)s9B:d6@localhost:3306/visasyst_impify')

# Create Flask app for migration
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = mysql_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

def create_folders_table():
    """Create the folders table if it doesn't exist"""

    # Raw SQL to create the folders table
    create_folders_table_sql = """
    CREATE TABLE IF NOT EXISTS `folders` (
      `id` varchar(36) NOT NULL,
      `user_id` varchar(36) NOT NULL,
      `name` varchar(100) NOT NULL,
      `description` text DEFAULT NULL,
      `color` varchar(7) DEFAULT '#3b82f6',
      `created_at` datetime DEFAULT current_timestamp(),
      `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    """

    # Create folder_notes association table
    create_folder_notes_table_sql = """
    CREATE TABLE IF NOT EXISTS `folder_notes` (
      `folder_id` varchar(36) NOT NULL,
      `note_id` varchar(36) NOT NULL,
      `added_at` datetime DEFAULT current_timestamp()
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    """

    # Add primary key and indexes for folders
    alter_folders_table_sql = """
    ALTER TABLE `folders`
      ADD PRIMARY KEY (`id`),
      ADD KEY `user_id` (`user_id`);
    """

    # Add primary key and indexes for folder_notes
    alter_folder_notes_table_sql = """
    ALTER TABLE `folder_notes`
      ADD PRIMARY KEY (`folder_id`,`note_id`),
      ADD KEY `note_id` (`note_id`);
    """

    # Add foreign key constraints
    add_folders_constraint_sql = """
    ALTER TABLE `folders`
      ADD CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
    """

    add_folder_notes_constraints_sql = """
    ALTER TABLE `folder_notes`
      ADD CONSTRAINT `folder_notes_ibfk_1` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`id`) ON DELETE CASCADE,
      ADD CONSTRAINT `folder_notes_ibfk_2` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`) ON DELETE CASCADE;
    """

    try:
        with app.app_context():
            # Execute the SQL commands
            db.engine.execute(create_folders_table_sql)
            print("✅ Folders table created successfully")

            db.engine.execute(create_folder_notes_table_sql)
            print("✅ Folder-notes association table created successfully")

            # Try to add indexes and constraints (they might already exist)
            try:
                db.engine.execute(alter_folders_table_sql)
                print("✅ Indexes added to folders table")
            except Exception as e:
                print(f"⚠️  Folders indexes might already exist: {e}")

            try:
                db.engine.execute(alter_folder_notes_table_sql)
                print("✅ Indexes added to folder_notes table")
            except Exception as e:
                print(f"⚠️  Folder-notes indexes might already exist: {e}")

            try:
                db.engine.execute(add_folders_constraint_sql)
                print("✅ Foreign key constraint added to folders table")
            except Exception as e:
                print(f"⚠️  Folders foreign key constraint might already exist: {e}")

            try:
                db.engine.execute(add_folder_notes_constraints_sql)
                print("✅ Foreign key constraints added to folder_notes table")
            except Exception as e:
                print(f"⚠️  Folder-notes foreign key constraints might already exist: {e}")

            print("🎉 Migration completed successfully!")
            print("📁 You can now use the folders feature in your application.")
            print("📝 Users can create folders and organize their notes and flashcards.")

    except Exception as e:
        print(f"❌ Migration failed: {e}")
        print("Please check your database connection and try again.")
        sys.exit(1)

if __name__ == "__main__":
    print("🚀 Starting folders table migration...")
    create_folders_table()