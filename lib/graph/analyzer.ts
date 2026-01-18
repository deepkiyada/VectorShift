/**
 * Graph Analysis Utilities
 * Provides functions to analyze directed graphs
 */

import { WorkflowNodePayload, WorkflowEdgePayload } from '@/lib/api/workflowApi'

/**
 * Graph analysis results
 */
export interface GraphAnalysisResult {
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

/**
 * Build adjacency list from edges
 */
function buildAdjacencyList(
  edges: WorkflowEdgePayload[],
  nodeIds: Set<string>
): Map<string, string[]> {
  const adjacencyList = new Map<string, string[]>()

  // Initialize all nodes
  nodeIds.forEach((nodeId) => {
    adjacencyList.set(nodeId, [])
  })

  // Build edges
  edges.forEach((edge) => {
    const source = edge.source
    const target = edge.target

    if (nodeIds.has(source) && nodeIds.has(target)) {
      const neighbors = adjacencyList.get(source) || []
      neighbors.push(target)
      adjacencyList.set(source, neighbors)
    }
  })

  return adjacencyList
}

/**
 * Calculate in-degrees for all nodes
 */
function calculateInDegrees(
  edges: WorkflowEdgePayload[],
  nodeIds: Set<string>
): Map<string, number> {
  const inDegrees = new Map<string, number>()

  // Initialize all nodes
  nodeIds.forEach((nodeId) => {
    inDegrees.set(nodeId, 0)
  })

  // Count in-degrees
  edges.forEach((edge) => {
    if (nodeIds.has(edge.target)) {
      const current = inDegrees.get(edge.target) || 0
      inDegrees.set(edge.target, current + 1)
    }
  })

  return inDegrees
}

/**
 * Detect cycles using DFS (Depth-First Search)
 * Returns all cycles found in the graph
 */
function detectCycles(
  adjacencyList: Map<string, string[]>,
  nodeIds: Set<string>
): string[][] {
  const cycles: string[][] = []
  const visited = new Set<string>()
  const recursionStack = new Set<string>()
  const path: string[] = []

  function dfs(node: string): boolean {
    if (recursionStack.has(node)) {
      // Found a cycle
      const cycleStart = path.indexOf(node)
      if (cycleStart !== -1) {
        const cycle = path.slice(cycleStart).concat([node])
        cycles.push(cycle)
      }
      return true
    }

    if (visited.has(node)) {
      return false
    }

    visited.add(node)
    recursionStack.add(node)
    path.push(node)

    const neighbors = adjacencyList.get(node) || []
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) {
        // Cycle detected, continue to find all cycles
      }
    }

    path.pop()
    recursionStack.delete(node)
    return false
  }

  // Check all nodes
  nodeIds.forEach((nodeId) => {
    if (!visited.has(nodeId)) {
      dfs(nodeId)
    }
  })

  return cycles
}

/**
 * Topological sort using Kahn's algorithm
 * Returns null if graph has cycles (not a DAG)
 */
function topologicalSort(
  adjacencyList: Map<string, string[]>,
  inDegrees: Map<string, number>
): string[] | null {
  const sorted: string[] = []
  const queue: string[] = []
  const inDegreeCopy = new Map(inDegrees)

  // Find all nodes with in-degree 0
  inDegreeCopy.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId)
    }
  })

  // Process nodes
  while (queue.length > 0) {
    const node = queue.shift()!
    sorted.push(node)

    const neighbors = adjacencyList.get(node) || []
    neighbors.forEach((neighbor) => {
      const currentDegree = inDegreeCopy.get(neighbor) || 0
      inDegreeCopy.set(neighbor, currentDegree - 1)

      if (inDegreeCopy.get(neighbor) === 0) {
        queue.push(neighbor)
      }
    })
  }

  // If we didn't process all nodes, there's a cycle
  if (sorted.length !== inDegrees.size) {
    return null
  }

  return sorted
}

/**
 * Calculate node degrees (in-degree and out-degree)
 */
function calculateNodeDegrees(
  edges: WorkflowEdgePayload[],
  nodeIds: Set<string>
): { [nodeId: string]: { inDegree: number; outDegree: number } } {
  const degrees: { [nodeId: string]: { inDegree: number; outDegree: number } } = {}

  // Initialize all nodes
  nodeIds.forEach((nodeId) => {
    degrees[nodeId] = { inDegree: 0, outDegree: 0 }
  })

  // Calculate degrees
  edges.forEach((edge) => {
    if (nodeIds.has(edge.source)) {
      degrees[edge.source].outDegree++
    }
    if (nodeIds.has(edge.target)) {
      degrees[edge.target].inDegree++
    }
  })

  return degrees
}

/**
 * Count connected components (weakly connected components for directed graphs)
 */
function countConnectedComponents(
  edges: WorkflowEdgePayload[],
  nodeIds: Set<string>
): number {
  // Convert to undirected graph for component counting
  const undirectedAdj = new Map<string, Set<string>>()

  nodeIds.forEach((nodeId) => {
    undirectedAdj.set(nodeId, new Set())
  })

  edges.forEach((edge) => {
    const sourceSet = undirectedAdj.get(edge.source) || new Set()
    const targetSet = undirectedAdj.get(edge.target) || new Set()
    sourceSet.add(edge.target)
    targetSet.add(edge.source)
    undirectedAdj.set(edge.source, sourceSet)
    undirectedAdj.set(edge.target, targetSet)
  })

  const visited = new Set<string>()
  let components = 0

  function dfs(node: string) {
    visited.add(node)
    const neighbors = undirectedAdj.get(node) || new Set()
    neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        dfs(neighbor)
      }
    })
  }

  nodeIds.forEach((nodeId) => {
    if (!visited.has(nodeId)) {
      dfs(nodeId)
      components++
    }
  })

  return components
}

/**
 * Analyze a directed graph
 * Determines if the graph is a DAG and calculates various metrics
 */
export function analyzeGraph(
  nodes: WorkflowNodePayload[],
  edges: WorkflowEdgePayload[]
): GraphAnalysisResult {
  // Get all node IDs
  const nodeIds = new Set(nodes.map((node) => node.id))

  // Filter edges to only include edges between existing nodes
  const validEdges = edges.filter(
    (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target)
  )

  // Build graph structures
  const adjacencyList = buildAdjacencyList(validEdges, nodeIds)
  const inDegrees = calculateInDegrees(validEdges, nodeIds)

  // Detect cycles
  const cycles = detectCycles(adjacencyList, nodeIds)
  const hasCycles = cycles.length > 0
  const isDAG = !hasCycles

  // Try topological sort (only possible for DAGs)
  const topologicallySorted = isDAG ? topologicalSort(adjacencyList, inDegrees) : null

  // Calculate additional metrics
  const nodeDegrees = calculateNodeDegrees(validEdges, nodeIds)
  const connectedComponents = countConnectedComponents(validEdges, nodeIds)

  return {
    nodeCount: nodes.length,
    edgeCount: validEdges.length,
    isDAG,
    hasCycles,
    connectedComponents,
    nodeDegrees,
    cycles: hasCycles ? cycles : undefined,
    topologicallySorted: topologicallySorted || undefined,
  }
}
