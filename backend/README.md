# DermaScan AI — Backend Base

This is the Python FastAPI backend base for DermaScan AI. It manages user authentication, stores scan history, and integrates with the Google Gemini Vision API for skin condition diagnostics.

## Features
- **User Authentication:** Bcrypt password hashing & JWT token validation.
- **AI Skin Diagnostics:** Built-in connection to Google Gemini Vision API (`gemini-1.5-flash`), with specialized prompts optimized for darker skin tones (Fitzpatrick type matching V/VI) and tropical climates.
- **Database Support:** Out-of-the-box local SQLite auto-configuration, with clean config overrides to plug in production PostgreSQL database.
- **Image Hosting:** Seamless Cloudinary integration, automatically falling back to secure local file storage if API credentials are not provided.
- **Interactive Documentation:** Automatic OpenAPI documentation available at `/docs` (Swagger UI).

---

## Getting Started

### Prerequisites
- Python 3.10 or higher installed.
- Pip package manager.

### 1. Installation
Navigate to the `backend` directory and install the required packages:
```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Configuration
Copy the template `.env.example` into a new `.env` file:
```bash
cp .env.example .env
```
Open `.env` and fill in the parameters (especially `GEMINI_API_KEY` for AI diagnostics and `CLOUDINARY_*` keys for image uploads).

### 3. Run the Development Server
Start uvicorn to launch the application:
```bash
uvicorn app.main:app --reload --port 8000
```
The server will start running at [http://127.0.0.1:8000](http://127.0.0.1:8000).

- **Interactive API Docs:** Visit [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health Check:** Visit [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## API Documentation Summary

### Authentication
- `POST /api/auth/signup` - Register a new user account.
- `POST /api/auth/login` - Authenticate credentials and retrieve bearer JWT token.

### Users & Settings
- `GET /api/users/me` - Fetch details of the current logged-in user.
- `PUT /api/users/me` - Update profile information.
- `PUT /api/users/me/settings` - Toggle scan reminders, language preferences, or privacy settings.

### Skin Scan Diagnostics
- `POST /api/scans/analyze` - Upload skin lesion image and symptom description to trigger AI analysis.
- `GET /api/scans/history` - Retrieve listing of previous scans.
- `GET /api/scans/{id}` - Fetch detail of a specific scan result.
