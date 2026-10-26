# KalaGanaka

KalaGanaka is a backend API for exploring traditional Indian astronomy, comparing planetary positions, accessing festival-rule information, and answering questions through a bilingual AI assistant.

## Features

- **Traditional astronomy:** Preliminary mean solar longitude calculation using a configured reference date and location.
- **Comparison engine:** Compares traditional and modern planetary longitude inputs and calculates normalized angular differences.
- **AI assistant:** Supports Hindi and English questions with provider fallback across configured AI services.
- **Festival knowledge:** Provides curated festival-rule information with verification-status metadata.
- **Health check:** Provides a simple API health endpoint.

## Technology Stack

- Python
- FastAPI
- Pydantic
- Uvicorn
- Pytest
- Configurable AI provider SDKs

## Setup

### 1. Create and activate a virtual environment

Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 2. Install dependencies

```powershell
python -m pip install -r requirements.txt
```

### 3. Configure environment variables

Create your local environment file from the example:

```powershell
Copy-Item .env.example .env
notepad .env
```

Add the API keys for the providers you intend to use. Keep real API keys in `.env` only. Never commit `.env` or publish secret keys.

Provider configuration is read from environment variables defined by the application, such as `XAI_API_KEY`, `GEMINI_API_KEY`, and `OPENROUTER_API_KEY`. Model names can also be configured through the corresponding model variables.

### 4. Run the application

From the backend directory:

```powershell
uvicorn app.main:app --reload
```

The development server normally runs at `http://127.0.0.1:8000`.

## API Documentation

When the server is running, visit:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

### Available endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Check whether the API is running |
| GET | `/traditional/solar-position?date=YYYY-MM-DD` | Calculate the preliminary mean solar longitude for a date |
| POST | `/comparison/compare` | Compare supplied traditional and modern position inputs |
| POST | `/assistant/chat` | Ask the bilingual AI assistant a question |
| GET | `/festivals` | List festival rules, optionally filtered by region |
| GET | `/festivals/{festival_id}` | Retrieve a festival rule by its ID |

Use `/docs` to inspect request schemas and example response formats.

## Running Tests

Run the complete test suite from the backend directory:

```powershell
python -m pytest -q
```

## Data Sources and Limitations

- The traditional astronomy implementation currently calculates **mean solar longitude**, not a complete true solar longitude with all traditional corrections.
- The configured reference date, reference longitude, and historical method require independent verification against reliable primary or scholarly sources.
- The comparison endpoint compares supplied inputs. Meaningful comparisons require compatible dates, coordinate systems, units, and astronomical conventions.
- The festival dataset is preliminary. Rules marked as needing verification must not be treated as authoritative festival-date predictions.
- The AI assistant depends on configured provider availability, credentials, model access, and service limits. AI-generated explanations should not replace deterministic calculations or verified sources.
- These endpoints should not be described as independently validated astronomical predictions unless further validation has been completed.
- The traditional astronomy implementation currently calculates **mean solar longitude**, not a complete true solar longitude with all traditional corrections.
- The configured reference date, reference longitude, and historical method require independent verification against reliable primary or scholarly sources.
## Security

- Keep `.env` out of version control.
- Keep `.env.example` limited to placeholder values.
- Do not expose API keys in frontend code, logs, screenshots, commits, or public repositories.

## Project Status

This is an ongoing project. The backend includes preliminary traditional calculations, comparison functionality, festival-rule lookup, and an AI assistant. Further work is required to verify historical assumptions, integrate trusted modern astronomy data, validate festival rules, and connect AI responses to deterministic results and traceable sources.
