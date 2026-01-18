"""
Unit tests for Pydantic workflow models.

Demonstrates model validation, flexibility, and resilience to extra data.
"""

import sys
from pathlib import Path

# Add parent directory to path for imports
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from models import (
    WorkflowPipeline,
    WorkflowNode,
    WorkflowEdge,
    Position,
    NodeData,
    HealthCheckResponse,
)


def test_position_model():
    """Test Position model with minimal and extra fields."""
    # Minimal required fields
    pos1 = Position(x=100.0, y=200.0)
    assert pos1.x == 100.0
    assert pos1.y == 200.0

    # With extra fields (should be allowed)
    pos2 = Position(x=100.0, y=200.0, extra_field="allowed")
    assert hasattr(pos2, "extra_field")


def test_node_data_model():
    """Test NodeData model with required and optional fields."""
    # Minimal required field (label)
    data1 = NodeData(label="My Node")
    assert data1.label == "My Node"
    assert data1.description is None

    # With optional fields
    data2 = NodeData(
        label="Node with Status",
        description="A test node",
        status="running",
        text="Some text content",
    )
    assert data2.status == "running"
    assert data2.text == "Some text content"

    # With extra fields
    data3 = NodeData(label="Node", custom_field="allowed")
    assert hasattr(data3, "custom_field")


def test_workflow_node_model():
    """Test WorkflowNode model."""
    node = WorkflowNode(
        id="node-1",
        type="process",
        position=Position(x=100.0, y=200.0),
        data=NodeData(label="Process Node"),
    )
    assert node.id == "node-1"
    assert node.type == "process"
    assert node.position.x == 100.0


def test_workflow_edge_model():
    """Test WorkflowEdge model with minimal required fields."""
    # Minimal required fields
    edge1 = WorkflowEdge(id="edge-1", source="node-1", target="node-2")
    assert edge1.id == "edge-1"
    assert edge1.source == "node-1"
    assert edge1.target == "node-2"

    # With optional fields
    edge2 = WorkflowEdge(
        id="edge-2",
        source="node-1",
        target="node-2",
        sourceHandle="output",
        targetHandle="input",
        animated=True,
    )
    assert edge2.animated is True


def test_workflow_pipeline_model():
    """Test complete WorkflowPipeline model."""
    pipeline = WorkflowPipeline(
        version="1.0.0",
        nodes=[
            WorkflowNode(
                id="node-1",
                type="start",
                position=Position(x=0, y=0),
                data=NodeData(label="Start"),
            ),
            WorkflowNode(
                id="node-2",
                type="end",
                position=Position(x=100, y=100),
                data=NodeData(label="End"),
            ),
        ],
        edges=[
            WorkflowEdge(id="edge-1", source="node-1", target="node-2"),
        ],
    )
    assert len(pipeline.nodes) == 2
    assert len(pipeline.edges) == 1
    assert pipeline.version == "1.0.0"


def test_workflow_pipeline_validation():
    """Test that pipeline validates edge references."""
    try:
        # This should raise ValueError because edge references non-existent node
        WorkflowPipeline(
            nodes=[
                WorkflowNode(
                    id="node-1",
                    type="start",
                    position=Position(x=0, y=0),
                    data=NodeData(label="Start"),
                ),
            ],
            edges=[
                WorkflowEdge(id="edge-1", source="node-1", target="nonexistent"),
            ],
        )
        assert False, "Should have raised ValueError"
    except ValueError as e:
        assert "nonexistent" in str(e)


def test_extra_fields_resilience():
    """Test that models accept extra fields without validation errors."""
    pipeline = WorkflowPipeline(
        extra_top_level_field="allowed",
        nodes=[
            WorkflowNode(
                id="node-1",
                type="start",
                position=Position(x=0, y=0),
                data=NodeData(label="Start"),
                extra_node_field="allowed",
            ),
        ],
        edges=[],
    )
    assert hasattr(pipeline, "extra_top_level_field")


if __name__ == "__main__":
    print("Running model tests...")
    test_position_model()
    test_node_data_model()
    test_workflow_node_model()
    test_workflow_edge_model()
    test_workflow_pipeline_model()
    test_workflow_pipeline_validation()
    test_extra_fields_resilience()
    print("✓ All tests passed!")
