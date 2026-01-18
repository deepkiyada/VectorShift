# VectorShift Backend API

FastAPI backend for validating workflow pipelines. Exposes a single POST endpoint that accepts nodes and edges, counts them, and determines whether the graph is a Directed Acyclic Graph (DAG).

## Overview

Validates workflow pipeline definitions by analyzing graph structure, counting nodes/edges, and detecting cycles. Designed for production use with minimal dependencies, clear error handling, and efficient DAG detection algorithms.

**Key Features:**
- Pipeline validation with node/edge counting
- Cycle detection using DFS algorithm
- DAG validation (acyclic graph verification)
- Type-safe Pydantic models for request/response validation
- Minimal, secure CORS configuration for frontend integration

## API Contract

### POST `/pipelines/parse`

Validates a workflow pipeline and returns statistics.

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

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Pipeline received: 2 node(s), 1 edge(s), valid DAG",
  "data": {
    "nodeCount": 2,
    "edgeCount": 1,
    "isDAG": true,
    "hasCycles": false,
    "version": "1.0.0",
    "parsedAt": "2024-01-01T12:00:00.000000Z"
  }
}
```

**Response Fields:**
- `nodeCount`: Number of valid nodes (integer)
- `edgeCount`: Number of valid edges (integer)
- `isDAG`: Boolean indicating if graph is acyclic (`true` = no cycles, `false` = contains cycles)
- `hasCycles`: Boolean indicating if cycles exist (inverse of `isDAG`)

**Error Responses:**
- `400 Bad Request`: Invalid payload structure or validation errors
- `422 Unprocessable Entity`: Pydantic validation errors (invalid node/edge structure)
- `500 Internal Server Error`: Server processing errors

## DAG Detection

Uses **Depth-First Search (DFS) with recursion stack tracking** to detect cycles in directed graphs.

**Algorithm:**
1. Build adjacency list representation from nodes and edges
2. For each unvisited node, perform DFS traversal
3. Track nodes in current recursion path (recursion stack)
4. If a back edge is detected (neighbor in recursion stack), cycle exists
5. Mark nodes as visited when fully processed (all descendants checked)

**Time Complexity:** O(V + E) where V = nodes, E = edges  
**Space Complexity:** O(V) for recursion stack and visited tracking

**Edge Cases Handled:**
- Empty graphs (considered valid DAGs)
- Disconnected components (multiple independent subgraphs)
- Self-loops (detected as cycles)
- Orphaned edges (filtered out before analysis)

## Design Decisions

### 1. Minimal Endpoint Surface
Single `/pipelines/parse` endpoint consolidates validation, counting, and DAG detection. Reduces API complexity and maintenance overhead.

### 2. Pydantic Request Validation
Strict type validation via Pydantic models (`WorkflowPipeline`, `WorkflowNode`, `WorkflowEdge`) ensures data integrity before processing. Invalid requests fail fast with clear error messages.

### 3. DFS for Cycle Detection
Chosen over Kahn's algorithm (topological sort) for simplicity and readability. DFS is straightforward to implement, debug, and maintains correctness. Performance is equivalent for typical workflow sizes (<1000 nodes).

### 4. Secure CORS Defaults
Minimal CORS configuration: only `GET`, `POST`, `OPTIONS` methods; `Content-Type`, `Authorization` headers. Localhost origins allowed for development. Production origins configurable via `CORS_ALLOWED_ORIGINS` environment variable.

### 5. Resilient Error Handling
Graceful degradation: filters invalid nodes/edges before processing, returns accurate counts for valid entries. Structured error responses include error codes and descriptive messages.

## Quick Start

### Prerequisites

- Python 3.9+ installed
- pip3 or python3 -m pip available

Check your Python version:
```bash
python3 --version
```

### Installation

**Using a virtual environment (recommended):**

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# OR on Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**Direct installation:**
```bash
pip3 install -r requirements.txt
# OR
python3 -m pip install -r requirements.txt
```

### Running the Server

```bash
# Using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or run as module
python main.py
```

The server starts at `http://localhost:8000`

**Development mode (auto-reload on code changes):**
```bash
uvicorn main:app --reload
```

### Environment Variables

```bash
# CORS Configuration (production)
export CORS_ALLOWED_ORIGINS="https://app.example.com,https://admin.example.com"
```

Default allows: `http://localhost:3000`, `http://127.0.0.1:3000`

## API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Architecture

```
backend/
├── main.py           # FastAPI app, route handlers
├── models.py         # Pydantic models (request/response validation)
├── graph_utils.py    # DAG detection algorithms
├── requirements.txt  # Python dependencies
└── tests/           # Unit tests
```

**Core Components:**
- `main.py`: FastAPI application with `/pipelines/parse` endpoint
- `models.py`: Type-safe request/response models (`WorkflowPipeline`, `WorkflowNode`, `WorkflowEdge`)
- `graph_utils.py`: Graph algorithms (`detect_cycles()`, `is_dag()`, `build_adjacency_list()`)

## Testing

Run unit tests:
```bash
python3 tests/test_models.py
python3 tests/test_graph_utils.py
```

## Production Deployment

For production, use a production ASGI server:

- **Gunicorn + Uvicorn workers**: `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker`
- **Docker**: Use official Python images with uvicorn
- **Cloud platforms**: Deploy to Railway, Render, or similar with ASGI support

**Recommended settings:**
- Set `CORS_ALLOWED_ORIGINS` environment variable
- Use process manager (systemd, supervisor, PM2)
- Enable HTTPS/TLS termination
- Configure logging and monitoring

## Troubleshooting

**Import errors:**
- Ensure virtual environment is activated
- Verify dependencies: `pip3 list | grep fastapi`

**CORS errors:**
- Check `CORS_ALLOWED_ORIGINS` matches frontend origin
- Verify backend allows frontend's HTTP method and headers

**Port already in use:**
- Change port: `uvicorn main:app --port 8001`
- Or kill existing process: `lsof -ti:8000 | xargs kill`

## Dependencies

- `fastapi==0.109.0`: Web framework with automatic API documentation
- `uvicorn[standard]==0.27.0`: ASGI server with HTTP/2 support

Minimal dependency footprint for easier maintenance and deployment.
