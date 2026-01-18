# Graph Analysis Library

Graph analysis utilities for analyzing directed graphs and determining if they are DAGs (Directed Acyclic Graphs).

## Overview

This library provides comprehensive graph analysis capabilities:
- **DAG Detection**: Determines if a graph is a Directed Acyclic Graph
- **Cycle Detection**: Finds all cycles in the graph
- **Topological Sort**: Sorts nodes in topological order (for DAGs)
- **Node Metrics**: Calculates in-degree and out-degree for each node
- **Connectivity**: Counts connected components

## Features

### 1. DAG Detection

Uses Kahn's algorithm to detect if a graph is a DAG:
- Builds adjacency list from edges
- Calculates in-degrees for all nodes
- Attempts topological sort
- Returns `null` if cycles are detected

### 2. Cycle Detection

Uses DFS (Depth-First Search) to find all cycles:
- Tracks visited nodes and recursion stack
- Detects back edges that form cycles
- Returns all cycles found in the graph

### 3. Node Metrics

Calculates for each node:
- **In-degree**: Number of incoming edges
- **Out-degree**: Number of outgoing edges

### 4. Connectivity

Counts weakly connected components:
- Converts directed graph to undirected for component counting
- Uses DFS to traverse components

## API

### `analyzeGraph(nodes, edges)`

Analyzes a directed graph and returns comprehensive results.

**Parameters:**
- `nodes: WorkflowNodePayload[]` - Array of nodes
- `edges: WorkflowEdgePayload[]` - Array of edges

**Returns:** `GraphAnalysisResult`

```typescript
interface GraphAnalysisResult {
  nodeCount: number
  edgeCount: number
  isDAG: boolean
  hasCycles: boolean
  connectedComponents?: number
  nodeDegrees?: {
    [nodeId: string]: {
      inDegree: number
      outDegree: number
    }
  }
  cycles?: string[][]
  topologicallySorted?: string[]
}
```

## Usage

```typescript
import { analyzeGraph } from '@/lib/graph'

const nodes = [
  { id: '1', type: 'start', position: { x: 0, y: 0 }, data: { label: 'Start' } },
  { id: '2', type: 'process', position: { x: 100, y: 0 }, data: { label: 'Process' } },
]

const edges = [
  { id: 'e1-2', source: '1', target: '2' },
]

const result = analyzeGraph(nodes, edges)

console.log(result.isDAG) // true
console.log(result.nodeCount) // 2
console.log(result.edgeCount) // 1
```

## Algorithm Details

### Kahn's Algorithm (Topological Sort)

1. Calculate in-degrees for all nodes
2. Find nodes with in-degree 0
3. Process each node and reduce in-degrees of neighbors
4. If all nodes are processed, graph is a DAG
5. If some nodes remain, graph has cycles

**Time Complexity:** O(V + E) where V = nodes, E = edges
**Space Complexity:** O(V + E)

### DFS Cycle Detection

1. Track visited nodes and recursion stack
2. For each node, perform DFS
3. If node is in recursion stack, cycle detected
4. Continue to find all cycles

**Time Complexity:** O(V + E)
**Space Complexity:** O(V)

## Example Results

### DAG Example

```json
{
  "nodeCount": 4,
  "edgeCount": 3,
  "isDAG": true,
  "hasCycles": false,
  "connectedComponents": 1,
  "nodeDegrees": {
    "1": { "inDegree": 0, "outDegree": 1 },
    "2": { "inDegree": 1, "outDegree": 1 },
    "3": { "inDegree": 1, "outDegree": 1 },
    "4": { "inDegree": 1, "outDegree": 0 }
  },
  "topologicallySorted": ["1", "2", "3", "4"]
}
```

### Cyclic Graph Example

```json
{
  "nodeCount": 3,
  "edgeCount": 3,
  "isDAG": false,
  "hasCycles": true,
  "connectedComponents": 1,
  "nodeDegrees": {
    "1": { "inDegree": 1, "outDegree": 1 },
    "2": { "inDegree": 1, "outDegree": 1 },
    "3": { "inDegree": 1, "outDegree": 1 }
  },
  "cycles": [["1", "2", "3", "1"]]
}
```

## API Endpoint

The graph analysis is available via API endpoint:

**POST** `/api/workflows/analyze`

**Request Body:**
```json
{
  "nodes": [...],
  "edges": [...]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "nodeCount": 4,
      "edgeCount": 3,
      "isDAG": true,
      "hasCycles": false,
      "connectedComponents": 1,
      "nodeDegrees": {...},
      "topologicallySorted": [...]
    },
    "metadata": {
      "analyzedAt": "2024-01-17T...",
      "workflowVersion": "1.0.0"
    }
  }
}
```

## Use Cases

1. **Workflow Validation**: Ensure workflows don't have circular dependencies
2. **Execution Planning**: Topological sort determines execution order
3. **Graph Metrics**: Understand graph structure and connectivity
4. **Debugging**: Identify problematic cycles in workflows

## Performance

- **Small graphs** (< 100 nodes): < 1ms
- **Medium graphs** (100-1000 nodes): < 10ms
- **Large graphs** (1000+ nodes): < 100ms

Algorithm is optimized for typical workflow sizes.
