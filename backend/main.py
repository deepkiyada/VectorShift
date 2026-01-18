"""
VectorShift Workflow Editor - FastAPI Backend

Minimal backend application with health-check endpoint.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Dict

from models import HealthCheckResponse, WorkflowPipeline, WorkflowResponse
from graph_utils import is_dag, detect_cycles

app = FastAPI(
    title="VectorShift Workflow API",
    description="Backend API for the VectorShift workflow editor",
    version="1.0.0",
)

# Configure CORS for Next.js frontend
# Minimal and secure by default - allows local development only
# In production, set CORS_ALLOWED_ORIGINS environment variable

# Allow localhost origins for local development
allowed_origins = [
    "http://localhost:3000",  # Next.js default dev port
    "http://127.0.0.1:3000",  # Alternative localhost format
]

# Allow additional origins from environment variable (for production)
if os.getenv("CORS_ALLOWED_ORIGINS"):
    additional_origins = [origin.strip() for origin in os.getenv("CORS_ALLOWED_ORIGINS").split(",")]
    allowed_origins.extend(additional_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # Only necessary methods
    allow_headers=["Content-Type", "Authorization"],  # Only necessary headers
    expose_headers=[],
    max_age=600,  # Cache preflight requests for 10 minutes
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


@app.post("/pipelines/parse", response_model=WorkflowResponse)
async def parse_pipeline(pipeline: WorkflowPipeline) -> WorkflowResponse:
    """
    Parse a workflow pipeline definition.
    
    Accepts a complete workflow pipeline with nodes and edges,
    validates the structure, and returns a confirmation response with
    accurate node count, edge count, and DAG validity.
    
    Args:
        pipeline: WorkflowPipeline definition containing nodes and edges
        
    Returns:
        WorkflowResponse with node count, edge count, and DAG validity
        Matches frontend contract format (GraphAnalysisData interface)
    """
    # Filter valid nodes and edges for accurate counting and validation
    valid_nodes = [
        node for node in (pipeline.nodes or [])
        if node is not None and node.id and node.position and node.data
    ]
    valid_edges = [
        edge for edge in (pipeline.edges or [])
        if edge is not None and edge.id and edge.source and edge.target
    ]

    # Calculate accurate counts
    node_count = len(valid_nodes)
    edge_count = len(valid_edges)

    # Determine DAG validity using cycle detection
    # Empty graph is considered a valid DAG (no cycles possible)
    has_cycles = False
    is_valid_dag = True
    
    if node_count > 0:
        has_cycles = detect_cycles(valid_nodes, valid_edges)
        is_valid_dag = is_dag(valid_nodes, valid_edges)

    # Build response matching frontend GraphAnalysisData interface
    response_data = {
        "nodeCount": node_count,
        "edgeCount": edge_count,
        "isDAG": is_valid_dag,
        "hasCycles": has_cycles,
        "version": pipeline.version,
        "parsedAt": datetime.utcnow().isoformat() + "Z",
    }

    # Build success message
    dag_status = "valid DAG" if is_valid_dag else "contains cycles"
    message = (
        f"Pipeline received: {node_count} node(s), {edge_count} edge(s), {dag_status}")

    return WorkflowResponse(
        success=True,
        message=message,
        data=response_data,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
