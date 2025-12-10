# Impify cPanel Deployment Guide

## Prerequisites
- cPanel hosting account with Python support
- MySQL database access
- SSH access to cPanel (recommended)

## Quick Deployment

### Step 1: Run Deployment Script
```bash
cd backend
python cpdeploy.py
```

This will:
- Build the React frontend
- Create deployment structure in `cpanel_deployment/`
- Update configuration for production

### Step 2: Upload Files to cPanel
Upload all files from `backend/cpanel_deployment/` to your cPanel `public_html` directory.

### Step 3: Set up Python Application in cPanel

1. **Access cPanel Python App**:
   - Login to cPanel
   - Go to "Setup Python App" (under Software section)

2. **Create Python Application**:
   - **Python version**: 3.8 or higher
   - **Application root**: `/home/username/public_html`
   - **Application URL**: `/`
   - **Startup file**: `passenger_wsgi.py`

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

### Step 4: Database Setup

1. **Create MySQL Database**:
   - Go to cPanel > MySQL Databases
   - Create new database and user
   - Grant all privileges to user

2. **Import Database Schema**:
   ```bash
   mysql -u username -p database_name < impify_db.sql
   ```

3. **Update Environment Variables**:
   Edit `.env` file:
   ```env
   MYSQL_URL=mysql+pymysql://db_user:db_password@localhost/db_name
   JWT_SECRET_KEY=your-secure-secret-key-here
   FLASK_ENV=production
   ```

### Step 5: Configure Environment

Update these variables in `.env`:
```env
# Database
MYSQL_URL=mysql+pymysql://username:password@localhost:3306/database

# Security
JWT_SECRET_KEY=generate-a-secure-random-key

# AI Services (optional)
OPENAI_API_KEY=your-openai-key
OLLAMA_URL=http://localhost:11434

# Flask
FLASK_ENV=production
DEBUG=False
```

### Step 6: Set File Permissions

```bash
# SSH into cPanel and run:
chmod -R 755 /home/username/public_html/
chmod 644 /home/username/public_html/.env
chmod +x /home/username/public_html/passenger_wsgi.py
```

### Step 7: Restart Application

In cPanel Python App interface:
- Click "Restart" to restart the application

## File Structure After Deployment

```
public_html/
├── passenger_wsgi.py      # WSGI entry point
├── server.py             # Flask application
├── .htaccess            # Apache configuration
├── requirements.txt     # Python dependencies
├── .env                # Environment variables
├── impify_db.sql       # Database schema
├── DEPLOYMENT_README.md # This file
├── static/             # React frontend
│   ├── index.html
│   ├── static/
│   └── ...
├── services/           # Backend services
├── chroma_db/          # Vector database
└── training/           # Training data
```

## Troubleshooting

### Common Issues:

1. **Application not loading**:
   - Check Python App logs in cPanel
   - Verify all dependencies are installed
   - Check file permissions

2. **Database connection errors**:
   - Verify MySQL credentials in `.env`
   - Ensure database exists and user has permissions
   - Check MySQL server is running

3. **Static files not loading**:
   - Verify React build was successful
   - Check `.htaccess` configuration
   - Ensure static files are in correct directory

4. **API endpoints not working**:
   - Check Flask routes are correct
   - Verify CORS configuration
   - Check Apache rewrite rules

### Logs Location:
- **cPanel Python logs**: cPanel > Python App > Logs
- **Apache error logs**: cPanel > Error Logs
- **Application logs**: Check `server.py` print statements

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET_KEY
- [ ] Enable SSL/HTTPS
- [ ] Restrict file permissions
- [ ] Regular backups
- [ ] Monitor error logs
- [ ] Keep dependencies updated

## Performance Optimization

1. **Enable caching** in cPanel
2. **Compress static files**
3. **Set up CDN** for static assets
4. **Monitor resource usage**
5. **Optimize database queries**

## Support

If you encounter issues:
1. Check cPanel error logs
2. Verify all steps were followed
3. Test locally before deploying
4. Contact hosting support if needed

## Post-Deployment

1. **Test all features**:
   - User registration/login
   - File upload and processing
   - Community features
   - Admin panel

2. **Set up monitoring**:
   - Check application health
   - Monitor error rates
   - Set up alerts

3. **Backup strategy**:
   - Regular database backups
   - File system backups
   - Configuration backups