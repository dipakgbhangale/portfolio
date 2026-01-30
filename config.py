import os
import secrets

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', secrets.token_hex(16))
    DATA_DIR = 'data'
    UPLOAD_FOLDER = 'static/uploads'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}
    
    # Credentials
    ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'password123')
    
    # Ensure upload directories exist
    @staticmethod
    def init_app(app):
        # Create upload directories if they don't exist
        # Skip on Vercel (read-only file system)
        if not os.environ.get('VERCEL'):
            try:
                os.makedirs(os.path.join(Config.UPLOAD_FOLDER, 'hero'), exist_ok=True)
                os.makedirs(os.path.join(Config.UPLOAD_FOLDER, 'certificates'), exist_ok=True)
                os.makedirs(os.path.join(Config.UPLOAD_FOLDER, 'icons'), exist_ok=True)
            except Exception as e:
                print(f"Warning: Could not create upload directories. {e}")
