# Voice-to-EHR Frontend

Next.js application for Voice-to-EHR system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Authentication system
- Patient dashboard
- Voice recording and transcription
- EHR text form with symptoms, diagnosis, and treatment sections

## Pages

- `/` - Authentication page
- `/dashboard` - Patient dashboard with list of patients
- `/patient/[id]` - Patient detail page with voice recording and EHR form

## API Integration

The frontend connects to a Flask backend running on `http://localhost:5000`. Make sure the backend server is running before using the application.

## Test Credentials

- Username: `doctor`
- Password: `password123`
