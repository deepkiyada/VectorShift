"""
Directed graph utilities for workflow pipeline validation.

Implements cycle detection and DAG validation algorithms,
prioritizing correctness and readability over performance.
"""

from typing import Dict, List, Set, Optional
from models import WorkflowNode, WorkflowEdge


def build_adjacency_list(nodes: List[WorkflowNode], edges: List[WorkflowEdge]) -> Dict[str, List[str]]:
    """
    Build an adjacency list representation of the directed graph.
    
    Args:
        nodes: List of workflow nodes
        edges: List of workflow edges
        
    Returns:
        Dictionary mapping node IDs to lists of connected node IDs (adjacency list)
    """
    # Create set of valid node IDs
    node_ids = {node.id for node in nodes if node and node.id}
    
    # Build adjacency list - only include edges between valid nodes
    adjacency_list: Dict[str, List[str]] = {node_id: [] for node_id in node_ids}
    
    for edge in edges:
        if not edge or not edge.id:
            continue
            
        source = edge.source
        target = edge.target
        
        # Only add edges where both source and target nodes exist
        if source in node_ids and target in node_ids:
            if source not in adjacency_list:
                adjacency_list[source] = []
            adjacency_list[source].append(target)
    
    return adjacency_list


def has_cycle_dfs(
    adjacency_list: Dict[str, List[str]],
    node_id: str,
    visited: Set[str],
    recursion_stack: Set[str],
) -> bool:
    """
    Helper function for DFS-based cycle detection.
    
    Uses a recursion stack to detect back edges, which indicate cycles.
    
    Args:
        adjacency_list: Graph representation as adjacency list
        node_id: Current node being processed
        visited: Set of nodes that have been fully processed
        recursion_stack: Set of nodes in the current recursion path
        
    Returns:
        True if a cycle is detected, False otherwise
    """
    # Mark current node as visited and add to recursion stack
    visited.add(node_id)
    recursion_stack.add(node_id)
    
    # Check all neighbors
    neighbors = adjacency_list.get(node_id, [])
    for neighbor in neighbors:
        # If neighbor is in recursion stack, we found a back edge (cycle)
        if neighbor in recursion_stack:
            return True
        
        # If neighbor hasn't been visited, recursively check it
        if neighbor not in visited:
            if has_cycle_dfs(adjacency_list, neighbor, visited, recursion_stack):
                return True
    
    # Remove from recursion stack when backtracking (all descendants processed)
    recursion_stack.remove(node_id)
    return False


def detect_cycles(nodes: List[WorkflowNode], edges: List[WorkflowEdge]) -> bool:
    """
    Determine whether a directed graph contains a cycle.
    
    Uses Depth-First Search (DFS) with recursion stack tracking to detect
    back edges, which indicate cycles in directed graphs.
    
    Algorithm:
    1. Build adjacency list representation of the graph
    2. For each unvisited node, perform DFS
    3. During DFS, track nodes in current recursion path
    4. If we encounter a node already in recursion stack, we found a cycle
    
    Args:
        nodes: List of workflow nodes (must have 'id' field)
        edges: List of workflow edges (must have 'source' and 'target' fields)
        
    Returns:
        True if the graph contains at least one cycle, False if it's acyclic (DAG)
        
    Example:
        >>> nodes = [WorkflowNode(id='1', ...), WorkflowNode(id='2', ...)]
        >>> edges = [WorkflowEdge(id='e1', source='1', target='2')]
        >>> detect_cycles(nodes, edges)
        False
        
        >>> edges_with_cycle = [
        ...     WorkflowEdge(id='e1', source='1', target='2'),
        ...     WorkflowEdge(id='e2', source='2', target='1')  # Creates cycle
        ... ]
        >>> detect_cycles(nodes, edges_with_cycle)
        True
    """
    # Handle empty graph (no nodes = no cycles, by definition)
    if not nodes or len(nodes) == 0:
        return False
    
    # Filter valid nodes and edges
    valid_nodes = [node for node in nodes if node and node.id]
    valid_edges = [edge for edge in edges if edge and edge.id and edge.source and edge.target]
    
    if len(valid_nodes) == 0:
        return False
    
    # Build adjacency list representation
    adjacency_list = build_adjacency_list(valid_nodes, valid_edges)
    
    # Track visited nodes (fully processed) and recursion stack (current path)
    visited: Set[str] = set()
    recursion_stack: Set[str] = set()
    
    # Perform DFS from each unvisited node
    # (necessary for disconnected components)
    node_ids = {node.id for node in valid_nodes}
    
    for node_id in node_ids:
        if node_id not in visited:
            if has_cycle_dfs(adjacency_list, node_id, visited, recursion_stack):
                return True
    
    # No cycles detected
    return False


def is_dag(nodes: List[WorkflowNode], edges: List[WorkflowEdge]) -> bool:
    """
    Determine whether a directed graph is a Directed Acyclic Graph (DAG).
    
    A DAG is a directed graph with no cycles. This function is the inverse
    of detect_cycles for semantic clarity.
    
    Args:
        nodes: List of workflow nodes
        edges: List of workflow edges
        
    Returns:
        True if the graph is a DAG (no cycles), False if it contains cycles
        
    Example:
        >>> is_dag(nodes, edges)
        True  # Graph is acyclic
    """
    return not detect_cycles(nodes, edges)


def get_cycles(nodes: List[WorkflowNode], edges: List[WorkflowEdge]) -> List[List[str]]:
    """
    Find all cycles in a directed graph.
    
    Returns a list of cycles, where each cycle is represented as a list
    of node IDs forming the cycle path.
    
    Note: This is a more complex operation than simple cycle detection.
    For now, returns an empty list if no cycles, or a placeholder if cycles exist.
    Full cycle enumeration can be implemented if needed.
    
    Args:
        nodes: List of workflow nodes
        edges: List of workflow edges
        
    Returns:
        List of cycles, where each cycle is a list of node IDs
    """
    # For now, just detect if cycles exist (simpler than enumerating all cycles)
    # Full cycle enumeration would require more complex DFS modifications
    has_cycles = detect_cycles(nodes, edges)
    
    if not has_cycles:
        return []
    
    # Placeholder: indicates cycles exist but doesn't enumerate them
    # Can be enhanced to return actual cycle paths if needed
    return [["cycle_detected"]]  # Indicates cycle exists without full enumeration
