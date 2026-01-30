from flask import render_template
from . import main_bp
from helpers import load_json

@main_bp.route('/')
def home():
    try:
        # Load all data for the portfolio
        hero = load_json('hero.json')
        about = load_json('about.json')
        skills = load_json('skills.json')
        experience = load_json('experience.json')
        projects = load_json('projects.json')
        certificates = load_json('certificates.json')
        contact = load_json('contact.json')
        
        return render_template('index.html', 
                            hero=hero, 
                            about=about, 
                            skills=skills, 
                            experience=experience, 
                            projects=projects, 
                            certificates=certificates, 
                            contact=contact)
    except Exception as e:
        import traceback
        return f"<h1>Error loading site</h1><pre>{traceback.format_exc()}</pre>", 500
