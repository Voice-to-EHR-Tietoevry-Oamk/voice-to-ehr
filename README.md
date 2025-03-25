# Voice-to-EHR

A fullstack application that converts doctor's voice recordings into structured Electronic Health Records (EHR).

## Project Structure

- **Frontend**: Next.js application
- **Backend**: Flask API

## Features

- Authentication system
- Patient dashboard and management
- Voice recording and real-time transcription
- Automatic conversion of speech to structured EHR format
- EHR text editing with symptoms, diagnosis, and treatment sections

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv/Scripts/activate

# Linux/Mac
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the backend server:
```bash
python wsgi.py
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## Usage

1. Open http://localhost:3000 in your browser
2. Log in with the test credentials:
   - Email: `doctor@example.com`
   - Password: `password123`
3. Browse the patient list and select a patient
4. Record your voice by clicking the record button
5. Review and edit the automatically generated EHR
6. Save the record to the patient's file

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Flask, Python
- **Voice Processing**: Web Audio API, SpeechRecognition
- **Data Format**: JSON