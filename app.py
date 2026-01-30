from flask import Flask
from flask_wtf.csrf import CSRFProtect
import json
import os
from config import Config
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize CSRF
csrf = CSRFProtect()

from helpers import load_json

# We will handle helpers in create_app

def create_app():
    app = Flask(__name__)
    
    # helper for jinja2 to load json
    from helpers import load_json
    app.jinja_env.globals.update(load_json=load_json)
    
    # Load config
    app.config.from_object(Config)
    Config.init_app(app)
    
    # Initialize extensions
    csrf.init_app(app)
    
    # Register Blueprints
    from routes import main_bp, auth_bp, admin_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
