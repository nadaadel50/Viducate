# Viducate

**AI-powered learning from educational videos.**

Viducate turns a lecture video (YouTube link or uploaded file) into a complete study kit: topic segments with timestamps, summaries, study notes, flashcards, quizzes, a mind map, a searchable index, and a chat assistant that answers questions about the video. It supports **Arabic and English**, including mixed-language lectures where the instructor speaks Arabic and the slides are in English.

---

## Features

| Feature | Description |
|---|---|
| **Video ingestion** | Submit a YouTube/direct URL, or upload a file (up to 1 GB) straight to Cloudflare R2 via a presigned URL |
| **Transcription** | Audio extraction + Whisper language detection + Groq `whisper-large-v3-turbo`, processed in 2-minute chunks |
| **OCR on slides/code** | PaddleOCR with pre-flight checks, slide-vs-code detection, noise/URL filtering and de-duplication |
| **Topic segmentation** | Transcript and OCR are merged by timestamp, then Gemini 2.5 Flash splits the video into segments and sub-topics (Groq Llama 3.3 70B as fallback) |
| **Quality scoring** | Every generated artifact is scored with embedding similarity against its source and automatically retried if it falls below a threshold |
| **Summaries** | Per-segment and whole-video structured summaries with highlighted terms and tooltips |
| **Study notes** | Definitions, examples, comparison tables and study tips per segment or video |
| **Flashcards** | Question/answer cards generated per segment, with difficulty levels |
| **Quizzes** | Multiple-choice quizzes (easy / medium / hard) per segment or for the whole video, graded server-side |
| **Mind map** | React-Flow-compatible nodes and edges (root → segment → sub-topic → detail / key point) |
| **Semantic search & chat** | RAG over the video using ChromaDB, a cross-encoder reranker, and Groq Llama 3.3 70B |
| **PDF export** | Download summaries and study notes as styled PDFs (RTL support for Arabic) |
| **Dashboard & reports** | Watch progress, storage usage, per-topic mastery levels, strong/weak topics |
| **Content language preferences** | Choose a different language for summaries, quizzes and flashcards per video |
| **Smart caching** | Videos are hashed by normalized URL; already-processed videos are cloned instantly instead of reprocessed |
| **Cancellable pipeline** | Users can cancel a running analysis; partial data is cleaned up |
| **Auth** | Email/password (bcrypt + JWT), Google OAuth, password reset by email, account lockout after repeated failures |

---

## Processing Pipeline

```
 URL / Upload
      │
      ▼
 1. Download (yt-dlp / direct R2 download)
      ▼
 2. Transcription ── audio extraction → language detection → Groq Whisper (2-min chunks)
      ▼
 3. OCR ──────────── pre-flight text check → slides/code detection → PaddleOCR → de-dup
      ▼
 4. Merge ────────── transcript + OCR aligned by timestamp
      ▼
 5. Segmentation ─── Gemini 2.5 Flash (fallback: Groq Llama 3.3 70B) → segments, sub-topics, key points
      │               └─ quality score vs. source text
      ▼
 6. Embeddings ───── multilingual-e5-base → ChromaDB (one collection per video)
      ▼
   completed  →  summaries / notes / flashcards / quizzes / mind map generated on demand
```

Processing runs as a FastAPI background task. Statuses: `uploaded → pending → processing → transcribing → ocr_processing → merging → segmenting → completed` (or `failed`, `failed_retry_tomorrow`, `cancelled`).

---

## Tech Stack

- **Backend:** Python, FastAPI, SQLAlchemy, Pydantic
- **Database:** PostgreSQL
- **Vector store:** ChromaDB (persistent, `./chroma_db`)
- **Object storage:** Cloudflare R2 (S3-compatible, via `boto3`)
- **LLMs / AI:**
  - Groq: `llama-3.3-70b-versatile` (summaries, notes, flashcards, quizzes, mind map, chat), `whisper-large-v3-turbo` (transcription)
  - Google Gemini: `gemini-2.5-flash` (segmentation)
  - OpenAI Whisper `base` (language detection)
  - `intfloat/multilingual-e5-base` (embeddings, quality scoring) and `BAAI/bge-reranker-base` (reranking)
- **Computer vision:** OpenCV, PaddleOCR
- **Media:** yt-dlp, pydub, ffmpeg
- **Auth:** python-jose (JWT), passlib (bcrypt), Authlib (Google OAuth), fastapi-mail
- **PDF:** Jinja2 + WeasyPrint
- **Frontend:** React (Vite) consumes this API

---

## Project Structure

```
Viducate/
└── backend/
    └── app/
        ├── main.py                  # FastAPI app and router registration
        ├── config.py                # Environment-based settings
        ├── dependencies.py          # DB session dependency
        ├── api/v1/endpoints/        # Route handlers (auth, video, summary, quiz, ...)
        ├── core/                    # Security (JWT, hashing), logging
        ├── db/                      # Engine, create/reset/seed scripts
        ├── models/                  # SQLAlchemy models
        ├── schemas/                 # Pydantic request/response schemas
        ├── repositories/            # Database access layer
        ├── services/                # Business logic (processing pipeline, auth, caching, ...)
        ├── ml/
        │   ├── engines/             # LLM prompt + call logic (flashcards, quiz, notes, mind map, chat)
        │   └── processors/          # OCR, flashcard, summary and study-notes processors
        └── utils/                   # PDF export, templates, reading time, text sanitizer
```

The code follows a layered design: **endpoint → service → repository → model**, with ML logic isolated in `ml/engines` and `ml/processors`.

---

## Getting Started

### Prerequisites

- Python 3.10+
- PostgreSQL
- [ffmpeg](https://ffmpeg.org/) available on your `PATH` (required for audio extraction)
- WeasyPrint system dependencies (Pango/Cairo) for PDF export
- DejaVu Sans fonts at `/usr/share/fonts/truetype/dejavu/` (used by the PDF templates)
- API keys for Groq and Gemini, and a Cloudflare R2 bucket

### Installation

```bash
git clone <your-repo-url>
cd Viducate/backend

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in `backend/`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/viducate

# Auth
SECRET_KEY=your-long-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback

# Email (password reset)
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_FROM=no-reply@example.com
MAIL_SERVER=smtp.example.com
MAIL_PORT=587

# Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY=...
R2_SECRET_KEY=...
R2_BUCKET_NAME=viducate
R2_PUBLIC_URL=            # optional; presigned download URLs are used if empty

# AI providers
GROQ_API_KEY=...
GROQ_API_KEY_segments=... # separate key used by the segmentation fallback
GEMINI_API_KEY=...

# YouTube Data API (video classification and duration)
Youtube_API_KEY=...
```

> Generate a strong `SECRET_KEY` with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

### Database Setup

```bash
# from backend/
python -m app.db.create_tables     # create all tables
python -m app.db.reset_database    # drop and recreate (destroys all data!)
```

### Run the Server

```bash
uvicorn app.main:app --reload
```

- API root: http://localhost:8000
- Interactive docs (Swagger): http://localhost:8000/docs

The first run downloads the embedding, reranker and Whisper models, so it may take a few minutes.

---

## API Overview

All routes are prefixed with `/api/v1`. Protected routes expect `Authorization: Bearer <token>`.

| Area | Endpoints |
|---|---|
| **Auth** | `POST /auth/register` · `POST /auth/login` · `GET /auth/me` · `POST /auth/logout` · `POST /auth/forgot-password` · `POST /auth/reset-password` · `GET /auth/google/login` |
| **Videos** | `POST /videos/url` · `POST /videos/upload` · `POST /videos/{id}/confirm` · `GET /videos/{id}/status` · `GET /videos` · `POST /videos/{id}/save` · `POST /videos/{id}/cancel` · `DELETE /videos/{id}` |
| **Segments** | `GET /segments/videos/{id}` · `GET /segments/videos/{id}/quality` |
| **Summaries** | `GET /summaries/video/{id}` · `GET /summaries/video/{id}/segments` · `GET /summaries/video/{id}/segment/{segment_id}` |
| **Study notes** | `GET /studynotes/video/{id}` · `POST /studynotes/video/{id}/regenerate` · `GET /studynotes/video/{id}/segment/{segment_id}` |
| **Flashcards** | `GET /flashcards/video/{id}` · `POST /flashcards/video/{id}/regenerate` · `GET` / `POST .../segment/{segment_id}[/generate]` |
| **Quiz** | `POST /quiz/video/{id}` · `POST /quiz/video/{id}/segment/{segment_id}` · `GET /quiz/{quiz_id}` · `POST /quiz/{quiz_id}/submit` |
| **Mind map** | `GET /mindmap/video/{id}` · `POST /mindmap/video/{id}/regenerate` |
| **Chat** | `POST /chat/ask` · `GET /chat/videos/{id}/sessions` · `GET /chat/videos/{id}/sessions/{session_id}/messages` · `DELETE /chat/videos/{id}/sessions/{session_id}` |
| **Search** | `POST /semantic_search/video/{id}/search` |
| **Export (PDF)** | `GET /export/summary/video/{id}` · `GET /export/studynotes/video/{id}` (plus `/segment/{segment_id}` variants) |
| **Dashboard & reports** | `GET /dashboard` · `GET /reports/video/{id}` |
| **Preferences** | `PUT /preferences/content-language` · `GET /preferences/content-language/{video_id}` |
| **Profile** | Get profile, update name/password, update language, delete account |
| **Slides** | `POST /slides/{video_id}/slides` (upload PDF/PPTX to extract slide text) |

Full request/response schemas are available in the Swagger UI.

---

## Limits and Rules

- Videos from YouTube must be **3 hours or shorter**.
- Entertainment categories (music, film, gaming, TV, news, lifestyle) and nasheeds are **blocked**.
- Storage: **1 GB per user** for uploaded files (R2) and for generated data (database); **10 GB** total R2 capacity for the service.
- Accepted upload formats: `.mp4`, `.mov`, `.avi`, `.mkv`, `.webm`, `.flv`.
- Accounts are locked for 15 minutes after 5 failed login attempts.
- Passwords require 8+ characters, an uppercase letter, a number, and a special character.

---

## Quality Validation

Generated content is checked against the stored segmentation using cosine similarity of `multilingual-e5-base` embeddings:

| Content | Threshold |
|---|---|
| Segmentation | 0.32 |
| Summary | 0.30 |
| Study notes | 0.28 |
| Mind map | 0.28 |
| Quiz | 0.27 |
| Flashcards | 0.25 |

If a result scores below its threshold, it is regenerated (up to 2 retries) and the best attempt is kept. Per-segment scores are exposed at `GET /segments/videos/{id}/quality`.

---

## Roadmap

- Slide matching: align uploaded PDF/PPTX slides with video segments
- Replace the in-memory slide store with Redis
- Replace `BackgroundTasks` with a task queue (Celery / SQS) for the processing pipeline
- Enable and configure CORS for the production frontend
- Docker Compose setup for one-command local development

---
