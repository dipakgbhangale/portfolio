# Portfolio Project

This is a personal portfolio website built with Flask.

## Prerequisites

- Python 3.x installed
- pip (Python package manager)

## Installation

1.  **Clone the repository** (if you haven't already).
2.  **Navigate to the project directory** in your terminal:
    ```bash
    cd "e:\4th yr\Practice\AntiGravity - Copy"
    ```
3.  **Create a virtual environment** (optional but recommended):
    ```bash
    python -m venv venv
    ```
4.  **Activate the virtual environment**:
    - Windows: `.\venv\Scripts\activate`
    - Mac/Linux: `source venv/bin/activate`
5.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## Usage

1.  **Run the application**:
    ```bash
    python app.py
    ```
2.  **Open your browser**:
    Go to [http://localhost:5000](http://localhost:5000).

## Admin Access

- **Login URL**: [http://localhost:5000/login](http://localhost:5000/login)
- **Default Credentials**:
    - Username: `admin`
    - Password: `password123`
    *(These can be changed in the `.env` file)*

## Project Structure

- `app.py`: Main Flask application.
- `static/`: CSS, JavaScript, and uploaded images.
- `templates/`: HTML templates.
- `data/`: JSON files storing portfolio content.
