#!/usr/bin/env python3
"""
cPanel Deployment Script for Impify
This script helps deploy the Flask + React application to cPanel
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

def build_frontend():
    """Build the React frontend"""
    print("Building React frontend...")

    frontend_dir = Path(__file__).parent.parent / "frontend"
    if not frontend_dir.exists():
        print("Frontend directory not found!")
        return False

    # Check if build already exists
    build_dir = frontend_dir / "build"
    if build_dir.exists():
        print("Frontend build already exists, skipping build step...")
        return True

    # Change to frontend directory
    os.chdir(frontend_dir)

    try:
        # Build the application (assuming npm dependencies are already installed)
        subprocess.run(["npm", "run", "build"], check=True)

        print("Frontend build completed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Build failed: {e}")
        return False

def create_deployment_structure():
    """Create the deployment directory structure"""
    print("Creating deployment structure...")

    backend_dir = Path(__file__).parent
    deploy_dir = backend_dir / "cpanel_deployment"

    # Create deployment directory
    deploy_dir.mkdir(exist_ok=True)

    # Copy backend files
    backend_files = [
        "server.py", "passenger_wsgi.py", ".htaccess", "requirements.txt",
        ".env", "impify_db.sql"
    ]

    for file in backend_files:
        src = backend_dir / file
        if src.exists():
            shutil.copy2(src, deploy_dir / file)

    # Copy backend directories
    backend_dirs = ["services", "chroma_db", "training"]
    for dir_name in backend_dirs:
        src_dir = backend_dir / dir_name
        dst_dir = deploy_dir / dir_name
        if src_dir.exists():
            shutil.copytree(src_dir, dst_dir, dirs_exist_ok=True)

    # Copy built frontend to static directory
    frontend_build = backend_dir.parent / "frontend" / "build"
    static_dir = deploy_dir / "static"

    if frontend_build.exists():
        shutil.copytree(frontend_build, static_dir, dirs_exist_ok=True)
    else:
        print("Warning: Frontend build not found. Run build_frontend() first.")

    print(f"Deployment structure created in: {deploy_dir}")
    return deploy_dir

def update_env_for_production(deploy_dir):
    """Update environment variables for production"""
    env_file = deploy_dir / ".env"

    if env_file.exists():
        print("Updating .env for production...")

        # Read current env file
        with open(env_file, 'r') as f:
            lines = f.readlines()

        # Update or add production settings
        updates = {
            "FLASK_ENV": "production",
            "DEBUG": "False",
            "TESTING": "False"
        }

        updated_lines = []
        for line in lines:
            key = line.split('=')[0].strip()
            if key in updates:
                updated_lines.append(f"{key}={updates[key]}\n")
            else:
                updated_lines.append(line)

        # Add missing keys
        for key, value in updates.items():
            if not any(line.startswith(f"{key}=") for line in updated_lines):
                updated_lines.append(f"{key}={value}\n")

        # Write back
        with open(env_file, 'w') as f:
            f.writelines(updated_lines)

        print(".env file updated for production")

def create_deployment_readme(deploy_dir):
    """Create deployment instructions"""
    readme_content = """
# Impify cPanel Deployment

## Deployment Steps:

1. Upload all files from `cpanel_deployment/` to your cPanel `public_html` directory

2. Set up Python App in cPanel:
   - Go to cPanel > Setup Python App
   - Choose Python version 3.8 or higher
   - Set Application root: /home/username/public_html
   - Set Application URL: /
   - Set Startup file: passenger_wsgi.py

3. Install Python dependencies:
   - In cPanel Python App interface, run: pip install -r requirements.txt

4. Set up MySQL Database:
   - Create database in cPanel MySQL Databases
   - Import impify_db.sql
   - Update MYSQL_URL in .env file

5. Configure Environment Variables:
   - Update .env file with your actual values
   - Set proper JWT_SECRET_KEY
   - Configure API keys (OpenAI, etc.)

6. Set File Permissions:
   - Directories: 755
   - Files: 644
   - Make passenger_wsgi.py executable: chmod +x passenger_wsgi.py

7. Restart Python Application in cPanel

## Troubleshooting:

- Check cPanel error logs
- Ensure all dependencies are installed
- Verify database connection
- Check file permissions
- Make sure Python version is compatible

## File Structure:
```
public_html/
├── passenger_wsgi.py    # WSGI entry point
├── server.py           # Flask application
├── .htaccess          # Apache configuration
├── requirements.txt   # Python dependencies
├── .env              # Environment variables
├── static/           # React build files
├── services/         # Backend services
├── chroma_db/        # Vector database
└── training/         # Training data
```
"""

    readme_file = deploy_dir / "DEPLOYMENT_README.md"
    with open(readme_file, 'w') as f:
        f.write(readme_content)

    print(f"Deployment README created: {readme_file}")

def main():
    """Main deployment function"""
    print("Starting Impify cPanel deployment preparation...")

    # Build frontend
    if not build_frontend():
        print("Frontend build failed!")
        return

    # Create deployment structure
    deploy_dir = create_deployment_structure()

    # Update environment
    update_env_for_production(deploy_dir)

    # Create deployment instructions
    create_deployment_readme(deploy_dir)

    print("\n" + "="*50)
    print("DEPLOYMENT PREPARATION COMPLETE!")
    print("="*50)
    print(f"Upload the contents of '{deploy_dir}' to your cPanel public_html directory")
    print("Follow the instructions in DEPLOYMENT_README.md")
    print("="*50)

if __name__ == "__main__":
    main()