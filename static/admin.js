
// --- GLOBAL STATE ---
let currentSection = 'welcome';
// Data is loaded from window.ADMIN_DATA (injected in HTML)

document.addEventListener('DOMContentLoaded', () => {
    loadSection('welcome');
});

function loadSection(section) {
    currentSection = section;

    // update Sidebar UI
    document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.classList.remove('active'));
    const btn = Array.from(document.querySelectorAll('.admin-nav-btn'))
        .find(b => b.getAttribute('onclick')?.includes(`'${section}'`));
    if (btn) btn.classList.add('active');

    // Special Case: Welcome Screen
    if (section === 'welcome') {
        document.getElementById('page-title').textContent = "Dashboard";
        const container = document.getElementById('dynamic-form');
        container.innerHTML = '';
        renderWelcome(container);
        return;
    }

    document.getElementById('page-title').textContent = section.charAt(0).toUpperCase() + section.slice(1);

    // Build Form
    const container = document.getElementById('dynamic-form');
    container.innerHTML = '';
    const data = window.ADMIN_DATA[section];

    if (!data) {
        container.innerHTML = '<p>Error loading data.</p>';
        return;
    }

    if (section === 'hero') renderHeroForm(container, data);
    else if (section === 'about') renderAboutForm(container, data);
    else if (section === 'skills') renderSkillsForm(container, data);
    else if (section === 'experience') renderExperienceForm(container, data);
    else if (section === 'projects') renderProjectsForm(container, data);
    else if (section === 'certificates') renderCertificatesForm(container, data);
    else if (section === 'contact') renderContactForm(container, data);
}

// --- FORM RENDERERS ---

function renderWelcome(container) {
    const wrapper = document.createElement('div');
    wrapper.style.textAlign = 'center';
    wrapper.style.marginTop = '10vh';
    wrapper.style.animation = 'fadeIn 1s ease';

    const h1 = document.createElement('h1');
    h1.innerText = "Welcome back, Master.";
    h1.style.fontSize = "3.5rem"; // Large font
    h1.style.background = "linear-gradient(135deg, #22d3ee, #a78bfa)";
    h1.style.webkitBackgroundClip = "text";
    h1.style.backgroundClip = "text";
    h1.style.color = "transparent";
    h1.style.marginBottom = "1rem";

    const p = document.createElement('p');
    p.innerText = "The Throne of Command has been waiting for you.";
    p.style.fontSize = "1.5rem";
    p.style.color = "var(--text-muted)";
    p.style.fontStyle = "italic";

    wrapper.appendChild(h1);
    wrapper.appendChild(p);
    container.appendChild(wrapper);
}

function renderHeroForm(container, data) {
    // Title
    container.appendChild(createInput('Title', data.title, (v) => data.title = v));

    // Image Upload / Select
    // Assuming 'img' field exists in Hero.json? Wait, user asked for: 
    // "image add / remove / reupload button (no image then text will be shown)"
    // Let's assume the JSON has an 'image' field? Currently it might not.
    // Let's add it to the form even if it's missing in JSON, and init it.
    if (!data.image) data.image = "";

    container.appendChild(createImageUpload('Profile Image', data.image, (url) => data.image = url, 'hero'));
}

function renderAboutForm(container, data) {
    container.appendChild(createInput('Title', data.title, (v) => data.title = v));
    container.appendChild(createTextarea('Description', data.description, (v) => data.description = v));
}

function renderSkillsForm(container, data) {
    // Add Category Button (Top)
    const addCatBtn = document.createElement('button');
    addCatBtn.className = 'add-btn';
    addCatBtn.innerHTML = '+ Add New Category';
    addCatBtn.style.marginBottom = "2rem";
    addCatBtn.onclick = () => {
        // Prepend new category
        data.unshift({ category: "New Category", items: [] });
        renderSkillsForm(container, data);
    };
    container.appendChild(addCatBtn);

    // List of Categories
    const listDiv = document.createElement('div');
    listDiv.className = 'item-list';

    data.forEach((cat, catIndex) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'list-item';

        // Remove Category Button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        removeBtn.onclick = () => {
            data.splice(catIndex, 1);
            renderSkillsForm(container, data); // Re-render
        };
        itemDiv.appendChild(removeBtn);

        // Category Name
        itemDiv.appendChild(createInput('Category Name', cat.category, (v) => cat.category = v));

        // Sub-items (Skills)
        const subListHeader = document.createElement('h4');
        subListHeader.innerText = "Skills in " + cat.category;
        subListHeader.style.marginTop = "1rem";
        subListHeader.style.color = "var(--primary)";
        itemDiv.appendChild(subListHeader);

        const subListDiv = document.createElement('div');
        subListDiv.style.marginLeft = "1rem";
        subListDiv.style.paddingLeft = "1rem";
        subListDiv.style.borderLeft = "2px solid var(--border)";

        // Add Skill Button (Top of Sublist)
        const addSkillBtn = document.createElement('button');
        addSkillBtn.className = 'btn btn-outline';
        addSkillBtn.style.fontSize = "0.8rem";
        addSkillBtn.style.marginBottom = "10px";
        addSkillBtn.innerText = "+ Add Skill";
        addSkillBtn.onclick = () => {
            // Prepend new skill
            cat.items.unshift({ name: "New Skill", icon: "fa-solid fa-code", color: "#ffffff" });
            renderSkillsForm(container, data);
        };
        subListDiv.appendChild(addSkillBtn);

        cat.items.forEach((skill, skillIndex) => {
            const skillDiv = document.createElement('div');
            skillDiv.style.background = "rgba(0,0,0,0.2)";
            skillDiv.style.padding = "10px";
            skillDiv.style.marginBottom = "10px";
            skillDiv.style.borderRadius = "5px";
            skillDiv.style.position = "relative";

            const delSkillBtn = document.createElement('button');
            delSkillBtn.className = 'remove-btn';
            delSkillBtn.style.top = "5px";
            delSkillBtn.style.right = "5px";
            delSkillBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
            delSkillBtn.onclick = () => {
                cat.items.splice(skillIndex, 1);
                renderSkillsForm(container, data);
            };
            skillDiv.appendChild(delSkillBtn);

            skillDiv.appendChild(createInput('Skill Name', skill.name, (v) => skill.name = v));
            // Icon Picker
            skillDiv.appendChild(createIconPicker('Icon', skill.icon, (v) => skill.icon = v));
            skillDiv.appendChild(createInput('Color', skill.color, (v) => skill.color = v, 'color')); // Color picker

            subListDiv.appendChild(skillDiv);
        });

        itemDiv.appendChild(subListDiv);
        listDiv.appendChild(itemDiv);
    });

    container.appendChild(listDiv);
}

function renderExperienceForm(container, data) {
    // Array of objects (year, title, subtitle, details)
    renderSimpleList(container, data, [
        { key: 'year', label: 'Year/Duration', type: 'text' },
        { key: 'title', label: 'Job Title', type: 'text' },
        { key: 'subtitle', label: 'Company/Subtitle', type: 'text' },
        { key: 'details', label: 'Details', type: 'textarea' }
    ]);
}


function renderProjectsForm(container, data) {
    // Array of objects
    // Auto-generate ID if missing
    data.forEach((p, i) => { if (!p.id) p.id = `project-${Date.now()}-${i}`; });


    renderSimpleList(container, data, [
        // ID is hidden/auto-managed now
        { key: 'title', label: 'Project Title', type: 'text' },
        { key: 'description', label: 'Short Description', type: 'textarea' },
        { key: 'modal_content', label: 'Full Details (HTML Allowed)', type: 'textarea' },
        { key: 'tags', label: 'Tags (Comma separated)', type: 'tags' }
    ]);
}

function renderCertificatesForm(container, data) {
    addAddBtn(container, "Certificate", () => {
        // Prepend
        data.unshift({ title: "New Certificate", img: "" });
        renderCertificatesForm(container, data);
    });

    const listDiv = document.createElement('div');
    listDiv.className = 'item-list';

    data.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'list-item';

        addRemoveBtn(itemDiv, () => {
            data.splice(index, 1);
            renderCertificatesForm(container, data);
        });

        itemDiv.appendChild(createInput('Title', item.title, (v) => item.title = v));
        // Image Upload
        itemDiv.appendChild(createImageUpload('Certificate Image', item.img, (url) => item.img = url, 'certificates'));

        listDiv.appendChild(itemDiv);
    });

    container.appendChild(listDiv);
}

function renderContactForm(container, data) {
    container.appendChild(createInput('Email', data.email, (v) => data.email = v));
    container.appendChild(createInput('Phone', data.phone, (v) => data.phone = v));

    const header = document.createElement('h3');
    header.innerText = "Social Links";
    header.style.color = "white";
    header.style.marginTop = "2rem";
    container.appendChild(header);

    renderSimpleList(container, data.social_links, [
        { key: 'platform', label: 'Platform Name', type: 'text' },
        { key: 'url', label: 'URL', type: 'text' },
        { key: 'icon', label: 'Icon Class (fa-brands...)', type: 'icon' }
    ], true); // append=true
}


// --- HELPER COMPONENTS ---

function createInput(label, value, onChange, type = 'text') {
    const group = document.createElement('div');
    group.className = 'form-group';

    const lbl = document.createElement('label');
    lbl.className = 'form-label';
    lbl.innerText = label;
    group.appendChild(lbl);

    const input = document.createElement('input');
    input.className = 'form-input';
    input.type = type;
    input.value = value || '';
    input.oninput = (e) => onChange(e.target.value);

    group.appendChild(input);
    return group;
}

function createTextarea(label, value, onChange) {
    const group = document.createElement('div');
    group.className = 'form-group';

    const lbl = document.createElement('label');
    lbl.className = 'form-label';
    lbl.innerText = label;
    group.appendChild(lbl);

    const input = document.createElement('textarea');
    input.className = 'form-textarea';
    input.rows = 5;
    input.value = value || '';
    input.oninput = (e) => onChange(e.target.value);

    group.appendChild(input);
    return group;
}

function createImageUpload(label, value, onChange, folder = 'misc') {
    const group = document.createElement('div');
    group.className = 'form-group';

    const lbl = document.createElement('label');
    lbl.className = 'form-label';
    lbl.innerText = label;
    group.appendChild(lbl);

    // Preview
    const imgPreview = document.createElement('img');
    imgPreview.className = 'image-preview';
    // If value is a static path (starts with static/), fix it for display if needed
    // Assuming value is like "static/uploads/..." or "Assets/..."
    // Since we are in flask, valid relative path works. 
    // BUT if value is empty, don't show broken img
    if (value) imgPreview.src = value;
    else imgPreview.style.display = 'none';

    // Controls
    const controls = document.createElement('div');
    controls.className = 'upload-controls';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    const uploadBtn = document.createElement('button');
    uploadBtn.className = 'btn btn-outline';
    uploadBtn.innerText = 'Upload Image';
    uploadBtn.onclick = () => fileInput.click();

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-outline';
    removeBtn.style.borderColor = '#ef4444';
    removeBtn.style.color = '#ef4444';
    removeBtn.innerText = 'Remove';
    removeBtn.onclick = () => {
        onChange('');
        imgPreview.src = '';
        imgPreview.style.display = 'none';
    };

    fileInput.onchange = async () => {
        if (fileInput.files.length === 0) return;
        const file = fileInput.files[0];

        // Upload Logic
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        uploadBtn.innerText = 'Uploading...';
        uploadBtn.disabled = true;

        try {
            const res = await fetch('/admin/upload', {
                method: 'POST',
                body: formData,
                headers: { 'X-CSRFToken': csrf_token }
            });
            const result = await res.json();

            if (result.success) {
                // Update Path
                onChange(result.filepath);
                imgPreview.src = result.filepath;
                imgPreview.style.display = 'block';
                showStatus('Image uploaded successfully!', 'success');
            } else {
                alert('Upload failed: ' + result.error);
            }
        } catch (e) {
            alert('Upload error: ' + e.message);
        } finally {
            uploadBtn.innerText = 'Upload Image';
            uploadBtn.disabled = false;
        }
    };

    controls.appendChild(uploadBtn);
    controls.appendChild(removeBtn);
    controls.appendChild(fileInput);

    group.appendChild(controls);
    group.appendChild(imgPreview);

    return group;
}

function createIconPicker(label, value, onChange) {
    // 3 Options: 1. Icon Class (Text), 2. Upload, 3. Default
    const group = document.createElement('div');
    group.className = 'form-group';

    const lbl = document.createElement('label');
    lbl.className = 'form-label';
    lbl.innerText = label;
    group.appendChild(lbl);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'icon-picker-options';

    // Determine current type
    // If value starts with 'static/' or 'http' -> Image
    // Else -> Class
    const isImage = value && (value.includes('/') || value.includes('\\'));

    const inputContainer = document.createElement('div');

    // Checkboxes to switch mode? No, just render both inputs and let last one win?
    // Let's simpler: Use a text input that supports class names, AND an upload button that overwrites the text input with the file path.

    const input = document.createElement('input');
    input.className = 'form-input';
    input.value = value || '';
    input.placeholder = "e.g. fa-brands fa-python OR static/uploads/...";
    input.oninput = (e) => onChange(e.target.value);

    const uploadBtn = document.createElement('button');
    uploadBtn.className = 'btn btn-outline';
    uploadBtn.innerText = 'Upload Icon';
    uploadBtn.style.marginTop = "10px";

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    uploadBtn.onclick = () => fileInput.click();

    fileInput.onchange = async () => {
        if (fileInput.files.length === 0) return;
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'icons');

        try {
            const res = await fetch('/admin/upload', {
                method: 'POST',
                body: formData,
                headers: { 'X-CSRFToken': csrf_token }
            });
            const result = await res.json();
            if (result.success) {
                input.value = result.filepath;
                onChange(result.filepath);
                showStatus('Icon uploaded!', 'success');
            }
        } catch (e) { alert(e.message); }
    };

    group.appendChild(input);
    group.appendChild(uploadBtn);
    group.appendChild(fileInput);

    return group;
}

// GENERIC LIST RENDERER
// GENERIC LIST RENDERER
function renderSimpleList(container, dataArray, fields, append = false) {
    if (!append) container.innerHTML = '';

    // Add Button First (Top)
    addAddBtn(container, "Item", () => {
        // Create empty object based on fields
        const newItem = {};
        fields.forEach(f => newItem[f.key] = f.type === 'tags' ? [] : "");

        // Special case for Projects: Auto-generate ID
        if (currentSection === 'projects') {
            newItem.id = `project-${Date.now()}`;
        }

        // Prepend
        dataArray.unshift(newItem);
        loadSection(currentSection);
    });

    const listDiv = document.createElement('div');
    listDiv.className = 'item-list';

    dataArray.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'list-item';

        addRemoveBtn(itemDiv, () => {
            dataArray.splice(index, 1);
            // Re-render
            // Hacky re-call based on currentSection
            loadSection(currentSection);
        });

        fields.forEach(f => {
            if (f.type === 'textarea') {
                itemDiv.appendChild(createTextarea(f.label, item[f.key], (v) => item[f.key] = v));
            } else if (f.type === 'tags') {
                // Handle array <-> string
                const val = Array.isArray(item[f.key]) ? item[f.key].join(', ') : item[f.key];
                itemDiv.appendChild(createInput(f.label, val, (v) => {
                    item[f.key] = v.split(',').map(s => s.trim()).filter(s => s);
                }));
            } else if (f.type === 'icon') {
                itemDiv.appendChild(createIconPicker(f.label, item[f.key], (v) => item[f.key] = v));
            } else {
                itemDiv.appendChild(createInput(f.label, item[f.key], (v) => item[f.key] = v));
            }
        });

        listDiv.appendChild(itemDiv);
    });

    container.appendChild(listDiv);
}

function addRemoveBtn(parent, action) {
    const btn = document.createElement('button');
    btn.className = 'remove-btn';
    btn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    btn.onclick = action;
    parent.appendChild(btn);
}

function addAddBtn(parent, label, action) {
    const btn = document.createElement('button');
    btn.className = 'add-btn';
    btn.innerText = `+ Add New ${label}`;
    btn.onclick = action;
    parent.appendChild(btn);
}

// --- SAVE LOGIC ---
async function saveCurrentSection() {
    const data = window.ADMIN_DATA[currentSection];
    if (!data) return;

    try {
        const response = await fetch(`/admin/update/${currentSection}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.success) {
            showStatus(`${currentSection} saved successfully!`, 'success');
        } else {
            showStatus('Error: ' + result.error, 'error');
        }
    } catch (e) {
        showStatus('Network Error', 'error');
    }
}

function showStatus(msg, type) {
    const el = document.getElementById('status-msg');
    el.innerText = msg;
    el.className = type;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
}
