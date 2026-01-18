"""
VectorShift Workflow Editor - FastAPI Backend

Minimal backend application with health-check endpoint.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Dict

from models import HealthCheckResponse, WorkflowPipeline, WorkflowResponse

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


@app.post("/pipelines/parse", response_model=WorkflowResponse)
async def parse_pipeline(pipeline: WorkflowPipeline) -> WorkflowResponse:
    """
    Parse a workflow pipeline definition.
    
    Accepts a complete workflow pipeline with nodes and edges,
    validates the structure, and returns a confirmation response with
    accurate node and edge counts.
    
    Args:
        pipeline: WorkflowPipeline definition containing nodes and edges
        
    Returns:
        WorkflowResponse confirming receipt with node and edge counts
    """
    # Calculate node count - handle None and filter invalid entries
    # Pydantic validates structure, but we ensure counts are accurate regardless of content
    if pipeline.nodes is None:
        node_count = 0
    else:
        # Count valid nodes (exclude None entries and ensure required fields have values)
        node_count = sum(
            1
            for node in pipeline.nodes
            if node is not None and node.id and node.position and node.data
        )

    # Calculate edge count - handle None and filter invalid entries
    if pipeline.edges is None:
        edge_count = 0
    else:
        # Count valid edges (exclude None entries and ensure required fields have values)
        edge_count = sum(
            1
            for edge in pipeline.edges
            if edge is not None and edge.id and edge.source and edge.target
        )

    return WorkflowResponse(
        success=True,
        message=f"Pipeline received successfully: {node_count} node(s), {edge_count} edge(s)",
        data={
            "nodeCount": node_count,
            "edgeCount": edge_count,
            "version": pipeline.version,
            "parsedAt": datetime.utcnow().isoformat() + "Z",
        },
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
