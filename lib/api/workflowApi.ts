/**
 * Workflow API Service
 * Handles submission of workflow nodes and edges to the backend API
 */

import { Node, Edge } from 'reactflow'
import { BaseNodeData, BaseNodeConfig } from '@/components/nodes/BaseNode'
import { TextNodeData } from '@/components/nodes/TextNode'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/workflows'

/**
 * Normalized node data for API submission
 * Extracts only the essential information needed by the backend
 */
export interface WorkflowNodePayload {
  id: string
  type: string
  position: {
    x: number
    y: number
  }
  data: {
    label: string
    description?: string
    text?: string
    status?: 'idle' | 'running' | 'success' | 'error'
    config?: {
      variant?: string
      size?: string
      handles?: {
        source?: boolean | string[]
        target?: boolean | string[]
      }
    }
    metadata?: Record<string, any>
  }
  width?: number
  height?: number
}

/**
 * Normalized edge data for API submission
 */
export interface WorkflowEdgePayload {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
  type?: string
  animated?: boolean
  style?: Record<string, any>
  data?: Record<string, any>
}

/**
 * Complete workflow payload structure
 * Clean, extensible structure for backend submission
 */
export interface WorkflowPayload {
  version: string
  metadata?: {
    name?: string
    description?: string
    createdAt?: string
    updatedAt?: string
  }
  nodes: WorkflowNodePayload[]
  edges: WorkflowEdgePayload[]
}

/**
 * API Response structure
 */
export interface WorkflowApiResponse {
  success: boolean
  data?: {
    workflowId?: string
    message?: string
  }
  error?: {
    code: string
    message: string
    details?: any
  }
}

/**
 * Transform React Flow node to API payload format
 */
function transformNode(node: Node): WorkflowNodePayload {
  // Guard: Ensure node has required properties
  if (!node || !node.id || !node.position) {
    throw new Error(`Invalid node: missing required properties (id: ${node?.id}, position: ${node?.position})`)
  }

  const baseData = node.data as BaseNodeData & TextNodeData & { config?: BaseNodeConfig }

  // Guard: Ensure position values are valid numbers
  const x = Number.isFinite(node.position.x) ? node.position.x : 0
  const y = Number.isFinite(node.position.y) ? node.position.y : 0

  return {
    id: String(node.id), // Ensure ID is string
    type: node.type || 'default',
    position: { x, y },
    data: {
      label: baseData.label || '',
      description: baseData.description,
      text: baseData.text,
      status: baseData.status,
      config: baseData.config
        ? {
            variant: baseData.config.variant,
            size: baseData.config.size,
            handles: baseData.config.handles,
          }
        : undefined,
      metadata: baseData.metadata,
    },
    ...(node.width && { width: node.width }),
    ...(node.height && { height: node.height }),
  }
}

/**
 * Transform React Flow edge to API payload format
 */
function transformEdge(edge: Edge): WorkflowEdgePayload {
  // Guard: Validate edge structure
  if (!edge || !edge.id || !edge.source || !edge.target) {
    throw new Error(`Invalid edge: missing required properties (id: ${edge?.id}, source: ${edge?.source}, target: ${edge?.target})`)
  }

  return {
    id: String(edge.id), // Ensure ID is string
    source: String(edge.source), // Ensure source is string
    target: String(edge.target), // Ensure target is string
    sourceHandle: edge.sourceHandle || null,
    targetHandle: edge.targetHandle || null,
    type: edge.type,
    animated: edge.animated,
    style: edge.style,
    data: edge.data,
  }
}

/**
 * Build workflow payload from nodes and edges
 */
export function buildWorkflowPayload(
  nodes: Node[],
  edges: Edge[],
  metadata?: WorkflowPayload['metadata']
): WorkflowPayload {
  // Guard: Validate inputs
  if (!Array.isArray(nodes)) {
    throw new Error('Nodes must be an array')
  }
  if (!Array.isArray(edges)) {
    throw new Error('Edges must be an array')
  }

  // Transform nodes and edges, filtering out any that fail transformation
  const validNodes: WorkflowNodePayload[] = []
  const validEdges: WorkflowEdgePayload[] = []

  for (const node of nodes) {
    try {
      validNodes.push(transformNode(node))
    } catch (error) {
      console.warn(`Skipping invalid node: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  for (const edge of edges) {
    try {
      validEdges.push(transformEdge(edge))
    } catch (error) {
      console.warn(`Skipping invalid edge: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return {
    version: '1.0.0',
    metadata: {
      ...metadata,
      updatedAt: new Date().toISOString(),
    },
    nodes: validNodes,
    edges: validEdges,
  }
}

/**
 * Submit workflow to backend API
 */
export async function submitWorkflow(
  payload: WorkflowPayload,
  options?: {
    endpoint?: string
    headers?: Record<string, string>
  }
): Promise<WorkflowApiResponse> {
  const endpoint = options?.endpoint || `${API_BASE_URL}/submit`
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }))

      return {
        success: false,
        error: {
          code: `HTTP_${response.status}`,
          message: errorData.message || 'Failed to submit workflow',
          details: errorData,
        },
      }
    }

    const data = await response.json()

    return {
      success: true,
      data: {
        workflowId: data.workflowId || data.id,
        message: data.message || 'Workflow submitted successfully',
      },
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error occurred',
        details: error,
      },
    }
  }
}

/**
 * Validate workflow payload before submission
 */
export function validateWorkflowPayload(payload: WorkflowPayload): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Validate nodes
  if (!Array.isArray(payload.nodes) || payload.nodes.length === 0) {
    errors.push('Workflow must contain at least one node')
  }

  // Validate node structure
  payload.nodes.forEach((node, index) => {
    if (!node.id) {
      errors.push(`Node at index ${index} is missing an ID`)
    }
    if (!node.type) {
      errors.push(`Node ${node.id} is missing a type`)
    }
    if (!node.data?.label) {
      errors.push(`Node ${node.id} is missing a label`)
    }
  })

  // Validate edges
  if (!Array.isArray(payload.edges)) {
    errors.push('Edges must be an array')
  }

  // Validate edge structure
  payload.edges.forEach((edge, index) => {
    if (!edge.id) {
      errors.push(`Edge at index ${index} is missing an ID`)
    }
    if (!edge.source) {
      errors.push(`Edge ${edge.id} is missing a source node`)
    }
    if (!edge.target) {
      errors.push(`Edge ${edge.id} is missing a target node`)
    }
  })

  // Validate edge references
  const nodeIds = new Set(payload.nodes.map((n) => n.id))
  payload.edges.forEach((edge) => {
    if (!nodeIds.has(edge.source)) {
      errors.push(`Edge ${edge.id} references non-existent source node: ${edge.source}`)
    }
    if (!nodeIds.has(edge.target)) {
      errors.push(`Edge ${edge.id} references non-existent target node: ${edge.target}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}
