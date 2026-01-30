import os
from flask import render_template, request, jsonify, session, redirect, url_for, current_app
from werkzeug.utils import secure_filename
from PIL import Image
from . import admin_bp
from helpers import load_json, save_json, allowed_file
from config import Config

@admin_bp.route('/admin')
def dashboard():
    if not session.get('logged_in'):
        return redirect(url_for('auth.login'))
        
    # Load data to populate forms
    data = {
        'hero': load_json('hero.json'),
        'about': load_json('about.json'),
        'skills': load_json('skills.json'),
        'experience': load_json('experience.json'),
        'projects': load_json('projects.json'),
        'certificates': load_json('certificates.json'),
        'contact': load_json('contact.json')
    }
    return render_template('admin.html', data=data)

@admin_bp.route('/admin/update/<section>', methods=['POST'])
def update_section(section):
    if not session.get('logged_in'):
        return jsonify({"error": "Unauthorized"}), 401
        
    filename = f"{section}.json"
    
    # Get JSON data from form submission (handled by JS in admin panel)
    try:
        new_data = request.get_json()
        
        # --- FILE CLEANUP LOGIC ---
        # 1. Load OLD data
        old_data = load_json(filename)
        
        # 2. Helper to find all file paths in a JSON object
        def extract_file_paths(obj):
            paths = set()
            if isinstance(obj, dict):
                for v in obj.values():
                    paths.update(extract_file_paths(v))
            elif isinstance(obj, list):
                for i in obj:
                    paths.update(extract_file_paths(i))
            elif isinstance(obj, str):
                # Identify if string is a file path in our uploads
                # We normalize slashes to matches
                normalized = obj.replace('\\', '/')
                if normalized.startswith('static/uploads/'):
                    paths.add(normalized)
            return paths

        # 3. Compare sets
        old_files = extract_file_paths(old_data)
        new_files = extract_file_paths(new_data)
        deleted_files = old_files - new_files

        # 4. Delete files
        for fpath in deleted_files:
            # Security check: Ensure we only delete from static/uploads
            if 'static/uploads/' in fpath:
                try:
                    # Convert to OS dependent path
                    abs_path = os.path.join(current_app.root_path, fpath.replace('/', os.sep))
                    if os.path.exists(abs_path):
                        os.remove(abs_path)
                        print(f"Deleted orphan file: {abs_path}")
                except Exception as e:
                    print(f"Error deleting file {fpath}: {e}")

        save_json(filename, new_data)
        return jsonify({"success": True, "message": f"{section} updated successfully!"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@admin_bp.route('/admin/upload', methods=['POST'])
def upload_file():
    if not session.get('logged_in'):
        return jsonify({"error": "Unauthorized"}), 401

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    folder = request.form.get('folder', 'misc') # specific subfolder
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Create subfolder if it doesn't exist (security check needed in prod, but ok for now)
        target_dir = os.path.join(Config.UPLOAD_FOLDER, folder)
        os.makedirs(target_dir, exist_ok=True)
        
        filepath = os.path.join(target_dir, filename)
        
        # --- IMAGE OPTIMIZATION ---
        try:
            # Open image using Pillow
            img = Image.open(file)
            
            # Convert to RGB (in case of RGBA for PNGs that we want to save as JPG, though we keep extension)
            # Actually, let's keep format but resize if too big
            
            # Max dimensions
            MAX_SIZE = (1200, 1200)
            img.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
            
            # Save optimized image
            # We can optionally convert to WebP here, but let's stick to original extension for now to avoid complexity in frontend
            # or just save with optimization
            img.save(filepath, optimization=True, quality=85)
            
        except Exception as e:
            # Fallback for non-image files or errors
            print(f"Image optimization failed: {e}")
            file.seek(0) # Reset file pointer
            file.save(filepath)
        
        # Return the relative path for the frontend to use
        # Force forward slashes for URL compatibility
        relative_path = os.path.join('static', 'uploads', folder, filename).replace('\\', '/')
        return jsonify({"success": True, "filepath": relative_path})
        
    return jsonify({"error": "File type not allowed"}), 400
