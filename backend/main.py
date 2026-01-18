"""
VectorShift Workflow Editor - FastAPI Backend

Minimal backend application with health-check endpoint.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Dict

from models import HealthCheckResponse

app = FastAPI(
    title="VectorShift Workflow API",
    description="Backend API for the VectorShift workflow editor",
    version="1.0.0",
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=HealthCheckResponse)
async def health_check() -> HealthCheckResponse:
    """
    Health check endpoint.
    
    Returns:
        HealthCheckResponse with status and timestamp confirming the server is running.
    """
    return HealthCheckResponse(
        status="healthy",
        service="vectorshift-workflow-api",
        timestamp=datetime.utcnow().isoformat() + "Z",
    )


@app.get("/health", response_model=HealthCheckResponse)
async def health() -> HealthCheckResponse:
    """
    Alternative health check endpoint (common convention).
    
    Returns:
        HealthCheckResponse with status and timestamp confirming the server is running.
    """
    return await health_check()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
