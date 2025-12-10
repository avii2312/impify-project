# Folders Feature Deployment Guide

This guide explains how to deploy the new folders functionality to your Impify application.

## What Was Added

- **Database**: New `folders` and `folder_notes` tables with many-to-many relationships
- **Backend**: Complete REST API for folder CRUD operations and note organization
- **Frontend**: Folder management UI components with glass morphism design
- **Integration**: Folders accessible across Dashboard, Notes, Flashcards, Paper Analysis, and Chat pages

## Deployment Steps

### 1. Database Migration

Run the SQL script to add the folders table to your existing database:

```sql
-- Connect to your MySQL database and run:
source backend/add_folders_table.sql
```

Or manually execute the SQL commands in `backend/add_folders_table.sql` in your database admin panel (phpMyAdmin, MySQL Workbench, etc.).

### 2. Backend Deployment

The backend code has been updated with:
- New `Folder` model in `server.py`
- Complete folder API routes (`/api/folders/*`)
- Proper error handling and analytics tracking

**No additional deployment steps needed** - the existing deployment process will include these changes.

### 3. Frontend Deployment

The frontend already has folder support implemented. No changes needed.

## API Endpoints Added

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/folders` | Get all user folders |
| POST | `/api/folders` | Create new folder |
| GET | `/api/folders/{id}` | Get specific folder |
| PUT | `/api/folders/{id}` | Update folder |
| DELETE | `/api/folders/{id}` | Delete folder |
| GET | `/api/folders/{id}/notes` | Get notes in folder |
| POST | `/api/folders/{id}/notes/{note_id}` | Add note to folder |
| DELETE | `/api/folders/{id}/notes/{note_id}` | Remove note from folder |

## Testing

After deployment:

1. **Test API**: Try creating a folder via the API
2. **Test Frontend**: The folder components should now work without 404 errors
3. **Check Logs**: Monitor for any errors in the application logs

## Rollback (if needed)

If you need to rollback:

1. **Database**: Drop the folders table
   ```sql
   DROP TABLE IF EXISTS folders;
   ```

2. **Code**: Revert the `server.py` changes (remove Folder model and routes)

## Features Implemented

- **Complete Folder Management**: Create, edit, delete folders with custom colors
- **Note Organization**: Add/remove notes to/from folders with many-to-many relationships
- **Cross-Page Integration**: Folders accessible in Dashboard, Notes, Flashcards, Paper Analysis, and Chat
- **Glass Morphism UI**: Consistent with existing design system
- **Responsive Design**: Works on all device sizes
- **Real-time Updates**: Changes reflect immediately across the application
- **Analytics Tracking**: All folder operations are tracked for insights

## Database Schema

- `folders` table: Stores folder metadata (name, description, color, user_id)
- `folder_notes` table: Many-to-many relationship between folders and notes
- Proper foreign key constraints with CASCADE delete

## Security

- All endpoints require JWT authentication
- Users can only access their own folders and notes
- Proper input validation and SQL injection protection

## Support

If you encounter issues:
1. Check the application logs
2. Verify the database migration completed successfully
3. Ensure the backend restarted after deployment