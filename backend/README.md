# Voice-to-EHR Backend

Flask API for Voice-to-EHR application.

## Setup

1. Create a virtual environment:
```
python -m venv venv
```

2. Activate virtual environment:
```
# Windows
venv/Scripts/activate

# Linux/Mac
source venv/bin/activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Run the application:
```
python wsgi.py
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username and password
- `GET /api/auth/verify` - Verify authentication

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/<id>` - Get patient by ID
- `GET /api/patients/<id>/records` - Get patient records
- `POST /api/patients/<id>/records` - Add patient record

### Voice
- `POST /api/voice/transcribe` - Transcribe audio to EHR format
- `POST /api/voice/save` - Save transcription to patient record 