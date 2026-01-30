import os
import json

CERT_DIR = r'static/uploads/certificates'
JSON_FILE = r'data/certificates.json'

def sanitize_filename(name):
    return name.replace(' ', '_')

def main():
    # 1. Load JSON
    if not os.path.exists(JSON_FILE):
        print(f"Error: {JSON_FILE} not found.")
        return

    with open(JSON_FILE, 'r') as f:
        data = json.load(f)

    # 2. Rename files
    if not os.path.exists(CERT_DIR):
        print(f"Error: {CERT_DIR} not found.")
        return

    files = os.listdir(CERT_DIR)
    renamed_map = {}

    for filename in files:
        if filename == '.gitkeep': continue
        
        new_name = sanitize_filename(filename)
        if new_name != filename:
            old_path = os.path.join(CERT_DIR, filename)
            new_path = os.path.join(CERT_DIR, new_name)
            
            # Rename file
            try:
                os.rename(old_path, new_path)
                print(f"Renamed: '{filename}' -> '{new_name}'")
                renamed_map[filename] = new_name
            except OSError as e:
                print(f"Error renaming {filename}: {e}")

    # 3. Update JSON
    updated = False
    for item in data:
        img_path = item.get('img', '')
        # extract filename from path
        # Assuming format "static/uploads/certificates/Filename.png"
        basename = os.path.basename(img_path)
        
        # Check if this basename needs update (either we just renamed it, OR it should have been renamed)
        # We need to constructing the expected new path
        
        # Using the map is safer if we just renamed it
        if basename in renamed_map:
            new_basename = renamed_map[basename]
            item['img'] = img_path.replace(basename, new_basename)
            updated = True
        elif ' ' in basename: 
             # Fallback: if file was already renamed manually or map missed it, force update JSON
             new_basename = sanitize_filename(basename)
             item['img'] = img_path.replace(basename, new_basename)
             updated = True

    if updated:
        with open(JSON_FILE, 'w') as f:
            json.dump(data, f, indent=4)
        print("Updated certificates.json")
    else:
        print("No JSON updates needed.")

if __name__ == '__main__':
    main()
