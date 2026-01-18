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

### Parse Pipeline

**POST** `/pipelines/parse`

Accepts a workflow pipeline definition and returns a confirmation with node/edge counts.

**Request Body:**
```json
{
  "version": "1.0.0",
  "nodes": [
    {
      "id": "node-1",
      "type": "start",
      "position": { "x": 0, "y": 0 },
      "data": { "label": "Start Node" }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pipeline received: 1 node(s), 1 edge(s), valid DAG",
  "data": {
    "nodeCount": 1,
    "edgeCount": 1,
    "isDAG": true,
    "hasCycles": false,
    "version": "1.0.0",
    "parsedAt": "2024-01-01T12:00:00.000000Z"
  }
}
```

**Response Fields (matches frontend GraphAnalysisData contract):**
- `nodeCount`: Number of valid nodes (integer)
- `edgeCount`: Number of valid edges (integer)
- `isDAG`: Boolean indicating if the graph is a Directed Acyclic Graph (true = no cycles, false = contains cycles)
- `hasCycles`: Boolean indicating if the graph contains cycles (inverse of isDAG)
- `version`: Pipeline schema version
- `parsedAt`: ISO timestamp of parsing

**Notes:**
- Node count includes only valid nodes (with `id`, `position`, and `data` fields)
- Edge count includes only valid edges (with `id`, `source`, and `target` fields)
- Counts are calculated accurately regardless of node/edge content or structure
- Empty pipelines return 0 for both counts and are considered valid DAGs (no cycles possible)
- DAG validation uses DFS-based cycle detection algorithm

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
