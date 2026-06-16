# Krissh's CS Portfolio Website

A full-stack modern portfolio website built with **Django REST Framework** (backend) and **React + Vite + TailwindCSS** (frontend).

## Features

- **Public Portfolio**: Minimalist, dark-themed UI fetching only `PUBLISHED` projects and experiences.
- **Admin Dashboard**: Full CRUD (Create, Read, Update, Delete) capability for projects and experiences.
- **Secure Authentication**: JWT-based authentication using memory storage for the access token and an `httpOnly` cookie for the refresh token (preventing XSS vulnerabilities).
- **Media Uploads**: Built-in endpoints for uploading thumbnails and company logos, automatically restricted to `5MB` and validated formats (`.jpg`, `.png`, `.webp`).
- **Supabase Integration**: Pre-configured to easily link up to a remote PostgreSQL database on Supabase.

---

## 1. Backend Setup (Django)

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd portfolio_backend
   ```

2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Setup environment variables:
   - Rename `.env.example` to `.env`
   - Add your **Supabase** credentials into the file, or leave `DB_NAME` empty to fall back to a local SQLite database for quick testing.

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create the Superuser (Admin account):
   ```bash
   python manage.py createsuperuser
   ```
   *(Enter your desired username, email, and password. This will be your login for the admin panel!)*

6. Run the server:
   ```bash
   python manage.py runserver
   ```
   The backend API will run on `http://localhost:8000`.

---

## 2. Frontend Setup (React/Vite)

1. Open a *new* terminal window and navigate to the frontend folder:
   ```bash
   cd portfolio_frontend
   ```

2. Install the Node modules:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or `http://localhost:3000`).

---

## Usage Guide

1. Open the frontend in your browser.
2. Click the **Login** button at the top right of the page.
3. Enter the Superuser credentials you created in step 5 of the backend setup.
4. If successful, you will be automatically redirected to the **Admin Dashboard** (`/admin`).
5. Use the dashboard to create Projects and Experiences. Note that only items marked as **PUBLISHED** will appear on the public landing page!
