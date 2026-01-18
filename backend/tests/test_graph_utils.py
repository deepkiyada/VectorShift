"""
Unit tests for graph utilities (cycle detection, DAG validation).
"""

import sys
from pathlib import Path

# Add parent directory to path for imports
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from graph_utils import detect_cycles, is_dag, build_adjacency_list
from models import WorkflowNode, WorkflowEdge, Position, NodeData


def test_empty_graph():
    """Test cycle detection on empty graph."""
    assert detect_cycles([], []) == False
    assert is_dag([], []) == True


def test_single_node():
    """Test cycle detection on single node (no edges)."""
    nodes = [WorkflowNode(id='1', type='start', position=Position(x=0, y=0), data=NodeData(label='Start'))]
    assert detect_cycles(nodes, []) == False
    assert is_dag(nodes, []) == True


def test_linear_graph():
    """Test cycle detection on linear graph (1 -> 2 -> 3)."""
    nodes = [
        WorkflowNode(id='1', type='start', position=Position(x=0, y=0), data=NodeData(label='Start')),
        WorkflowNode(id='2', type='process', position=Position(x=100, y=0), data=NodeData(label='Process')),
        WorkflowNode(id='3', type='end', position=Position(x=200, y=0), data=NodeData(label='End')),
    ]
    edges = [
        WorkflowEdge(id='e1', source='1', target='2'),
        WorkflowEdge(id='e2', source='2', target='3'),
    ]
    assert detect_cycles(nodes, edges) == False
    assert is_dag(nodes, edges) == True


def test_simple_cycle():
    """Test cycle detection on graph with cycle (1 -> 2 -> 1)."""
    nodes = [
        WorkflowNode(id='1', type='start', position=Position(x=0, y=0), data=NodeData(label='Node 1')),
        WorkflowNode(id='2', type='process', position=Position(x=100, y=0), data=NodeData(label='Node 2')),
    ]
    edges = [
        WorkflowEdge(id='e1', source='1', target='2'),
        WorkflowEdge(id='e2', source='2', target='1'),  # Creates cycle
    ]
    assert detect_cycles(nodes, edges) == True
    assert is_dag(nodes, edges) == False


def test_self_loop():
    """Test cycle detection on graph with self-loop (1 -> 1)."""
    nodes = [WorkflowNode(id='1', type='start', position=Position(x=0, y=0), data=NodeData(label='Node 1'))]
    edges = [WorkflowEdge(id='e1', source='1', target='1')]  # Self-loop
    assert detect_cycles(nodes, edges) == True
    assert is_dag(nodes, edges) == False


def test_disconnected_components():
    """Test cycle detection on disconnected components."""
    nodes = [
        WorkflowNode(id='1', type='start', position=Position(x=0, y=0), data=NodeData(label='Node 1')),
        WorkflowNode(id='2', type='start', position=Position(x=0, y=100), data=NodeData(label='Node 2')),
    ]
    edges = []  # No edges = two disconnected nodes
    assert detect_cycles(nodes, edges) == False
    assert is_dag(nodes, edges) == True


def test_complex_acyclic():
    """Test cycle detection on complex acyclic graph."""
    nodes = [
        WorkflowNode(id='1', type='start', position=Position(x=0, y=0), data=NodeData(label='Node 1')),
        WorkflowNode(id='2', type='process', position=Position(x=100, y=0), data=NodeData(label='Node 2')),
        WorkflowNode(id='3', type='process', position=Position(x=100, y=100), data=NodeData(label='Node 3')),
        WorkflowNode(id='4', type='end', position=Position(x=200, y=50), data=NodeData(label='Node 4')),
    ]
    edges = [
        WorkflowEdge(id='e1', source='1', target='2'),
        WorkflowEdge(id='e2', source='1', target='3'),
        WorkflowEdge(id='e3', source='2', target='4'),
        WorkflowEdge(id='e4', source='3', target='4'),
    ]
    assert detect_cycles(nodes, edges) == False
    assert is_dag(nodes, edges) == True


def test_complex_cyclic():
    """Test cycle detection on complex graph with cycle."""
    nodes = [
        WorkflowNode(id='1', type='start', position=Position(x=0, y=0), data=NodeData(label='Node 1')),
        WorkflowNode(id='2', type='process', position=Position(x=100, y=0), data=NodeData(label='Node 2')),
        WorkflowNode(id='3', type='process', position=Position(x=200, y=0), data=NodeData(label='Node 3')),
        WorkflowNode(id='4', type='end', position=Position(x=150, y=100), data=NodeData(label='Node 4')),
    ]
    edges = [
        WorkflowEdge(id='e1', source='1', target='2'),
        WorkflowEdge(id='e2', source='2', target='3'),
        WorkflowEdge(id='e3', source='3', target='4'),
        WorkflowEdge(id='e4', source='4', target='2'),  # Creates cycle: 2 -> 3 -> 4 -> 2
    ]
    assert detect_cycles(nodes, edges) == True
    assert is_dag(nodes, edges) == False


def test_build_adjacency_list():
    """Test adjacency list building."""
    nodes = [
        WorkflowNode(id='1', type='start', position=Position(x=0, y=0), data=NodeData(label='Node 1')),
        WorkflowNode(id='2', type='process', position=Position(x=100, y=0), data=NodeData(label='Node 2')),
    ]
    edges = [
        WorkflowEdge(id='e1', source='1', target='2'),
    ]
    
    adj_list = build_adjacency_list(nodes, edges)
    assert '1' in adj_list
    assert '2' in adj_list
    assert adj_list['1'] == ['2']
    assert adj_list['2'] == []


if __name__ == "__main__":
    print("Running graph utility tests...")
    test_empty_graph()
    print("✓ Empty graph")
    
    test_single_node()
    print("✓ Single node")
    
    test_linear_graph()
    print("✓ Linear graph")
    
    test_simple_cycle()
    print("✓ Simple cycle")
    
    test_self_loop()
    print("✓ Self-loop")
    
    test_disconnected_components()
    print("✓ Disconnected components")
    
    test_complex_acyclic()
    print("✓ Complex acyclic graph")
    
    test_complex_cyclic()
    print("✓ Complex cyclic graph")
    
    test_build_adjacency_list()
    print("✓ Adjacency list building")
    
    print("\n✓ All tests passed!")
