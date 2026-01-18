"""
Pydantic models for workflow pipeline data structures.

These models represent the workflow graph structure with nodes and edges,
designed to be flexible and resilient to extra data while enforcing
required fields for core functionality.
"""

from typing import Optional, Dict, Any, List, Literal
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, model_validator


class Position(BaseModel):
    """2D position coordinates for a node."""

    x: float = Field(..., description="X coordinate")
    y: float = Field(..., description="Y coordinate")

    model_config = ConfigDict(extra="allow")


class NodeConfig(BaseModel):
    """Configuration for a workflow node."""

    variant: Optional[str] = Field(None, description="Visual variant (default, primary, success, etc.)")
    size: Optional[str] = Field(None, description="Node size (small, medium, large)")
    handles: Optional[Dict[str, Any]] = Field(None, description="Handle configuration")

    model_config = ConfigDict(extra="allow")


class NodeData(BaseModel):
    """Data payload for a workflow node."""

    label: str = Field(..., description="Node label (required)")
    description: Optional[str] = Field(None, description="Node description")
    text: Optional[str] = Field(None, description="Text content (for text nodes)")
    status: Optional[Literal["idle", "running", "success", "error"]] = Field(
        None, description="Node execution status"
    )
    config: Optional[NodeConfig] = Field(None, description="Node configuration")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")

    model_config = ConfigDict(extra="allow")


class WorkflowNode(BaseModel):
    """Represents a single node in the workflow graph."""

    id: str = Field(..., description="Unique node identifier (required)")
    type: str = Field(default="default", description="Node type identifier")
    position: Position = Field(..., description="Node position on canvas (required)")
    data: NodeData = Field(..., description="Node data payload (required)")
    width: Optional[float] = Field(None, description="Node width in pixels")
    height: Optional[float] = Field(None, description="Node height in pixels")

    model_config = ConfigDict(extra="allow")


class WorkflowEdge(BaseModel):
    """Represents a connection between two nodes in the workflow graph."""

    id: str = Field(..., description="Unique edge identifier (required)")
    source: str = Field(..., description="Source node ID (required)")
    target: str = Field(..., description="Target node ID (required)")
    sourceHandle: Optional[str] = Field(None, description="Source handle identifier")
    targetHandle: Optional[str] = Field(None, description="Target handle identifier")
    type: Optional[str] = Field(None, description="Edge type (e.g., 'smoothstep', 'bezier')")
    animated: Optional[bool] = Field(None, description="Whether edge is animated")
    style: Optional[Dict[str, Any]] = Field(None, description="Edge styling")
    data: Optional[Dict[str, Any]] = Field(None, description="Additional edge data")

    model_config = ConfigDict(extra="allow")


class WorkflowMetadata(BaseModel):
    """Metadata for the workflow."""

    name: Optional[str] = Field(None, description="Workflow name")
    description: Optional[str] = Field(None, description="Workflow description")
    createdAt: Optional[str] = Field(None, description="ISO timestamp of creation")
    updatedAt: Optional[str] = Field(None, description="ISO timestamp of last update")

    model_config = ConfigDict(extra="allow")


class WorkflowPipeline(BaseModel):
    """Complete workflow pipeline structure."""

    version: str = Field(default="1.0.0", description="Workflow schema version")
    metadata: Optional[WorkflowMetadata] = Field(None, description="Workflow metadata")
    nodes: List[WorkflowNode] = Field(default_factory=list, description="List of workflow nodes")
    edges: List[WorkflowEdge] = Field(default_factory=list, description="List of workflow edges")

    model_config = ConfigDict(extra="allow")

    @model_validator(mode="after")
    def validate_edge_references(self) -> "WorkflowPipeline":
        """Validate that edge source/target nodes exist."""
        node_ids = {node.id for node in self.nodes}
        for edge in self.edges:
            if edge.source not in node_ids:
                raise ValueError(f"Edge {edge.id} references non-existent source node: {edge.source}")
            if edge.target not in node_ids:
                raise ValueError(f"Edge {edge.id} references non-existent target node: {edge.target}")
        return self


# Request/Response models for API endpoints

class WorkflowResponse(BaseModel):
    """Standard API response wrapper."""

    success: bool = Field(..., description="Whether the operation succeeded")
    message: Optional[str] = Field(None, description="Response message")
    data: Optional[Dict[str, Any]] = Field(None, description="Response data payload")

    model_config = ConfigDict(extra="allow")


class HealthCheckResponse(BaseModel):
    """Health check endpoint response."""

    status: str = Field(default="healthy", description="Service status")
    service: str = Field(default="vectorshift-workflow-api", description="Service name")
    timestamp: str = Field(..., description="ISO timestamp")

    model_config = ConfigDict(extra="allow")
