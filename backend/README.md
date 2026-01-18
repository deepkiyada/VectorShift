# VectorShift Backend API

Minimal FastAPI backend application for the VectorShift workflow editor.

## Setup

### Prerequisites

- Python 3.9+ installed
- pip3 or python3 -m pip available

Check your Python version:
```bash
python3 --version
```

### Install Dependencies

**Option 1: Direct installation (not recommended for development)**
```bash
pip3 install -r requirements.txt
# OR
python3 -m pip install -r requirements.txt
```

**Option 2: Using a virtual environment (recommended)**

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# OR on Windows:
# venv\Scripts\activate

# Install dependencies (pip is now available after activation)
pip install -r requirements.txt
```

**Troubleshooting:**
- If `pip` command not found, use `pip3` or `python3 -m pip`
- If permission errors, use `--user` flag: `pip3 install --user -r requirements.txt`
- Always activate the virtual environment before installing: `source venv/bin/activate`

### Run the Server

```bash
# Using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or run as module
python main.py
```

The server will start at `http://localhost:8000`

## API Endpoints

### Health Check

**GET** `/` or `/health`

Returns server status and timestamp.

**Response:**
```json
{
  "status": "healthy",
  "service": "vectorshift-workflow-api",
  "timestamp": "2024-01-01T12:00:00.000000Z"
}
```

## API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (Next.js dev server)
- `http://127.0.0.1:3000`

To add additional origins, modify the `allow_origins` list in `main.py`.

## Development

The server runs in development mode with auto-reload enabled when using:
```bash
uvicorn main:app --reload
```

## Production

For production deployments, use a production ASGI server like:
- Gunicorn with Uvicorn workers
- Docker with proper process management
- Cloud platform ASGI support (Railway, Render, etc.)
