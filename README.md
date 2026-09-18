# SwordByte

## Overview

SwordByte is an AI-powered learning platform that helps students study smarter by generating summaries, quizzes, and personalized study plans from uploaded study materials.

## Features

* Smart Material Upload
* AI Summary Generation
* Ask My Notes
* AI Quiz Generator
* Weak Topic Detection
* Personalized Study Plan
* Progress Tracking

## Tech Stack

* PDF text extraction
* GeminiAI Responses API
* Multer for PDF uploads

### Frontend

* HTML
* CSS
* JavaScript
* React.js + vite

### Backend

* Node.js
* Express.js

### Database

* MongoDB + Mongoose

## Installation

```bash 
git clone <repository-url>
```
 
## Forntend

```bash

cd SwordByte
npm install
npm start
```

## Backend

```bash
cd server
npm install
copy .env.example .env
```

## Edit  .env

```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/learnmate
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.1-flash-lite
CLIENT_URL=http://localhost:5173
MAX_PDF_MB=10
```

## Demo flow

1. Open Dashboard.
2. Go to Upload Material.
3. Upload a PDF.
4. Open Notes.
5. Ask the AI Tutor a question.
6. Generate a quiz.
7. Submit answers.
8. See the Learning Gaps screen.
9. Generate the Study Plan.
10. Open Progress.


## Project structure

```text
learnmate/
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env.example
│   └── server.js
└── README.md
```

## Production improvements

For production, add:

- Authentication/JWT
- Per-user document authorization
- Cloud object storage for PDFs
- Rate limiting
- Input validation
- Background PDF/AI jobs
- Vector search/RAG for very large documents
- AI cost controls
- Audit logging
- HTTPS
- MongoDB indexes


## Team Members

* Nitish Kumar
* Guddu Kumar Pandey
* Praveen Kumar Sah
* Krish Kumar

## License

This project is developed for hackathon purposes.