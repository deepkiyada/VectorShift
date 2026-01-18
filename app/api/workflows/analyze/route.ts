/**
 * Workflow Graph Analysis API Route
 * Analyzes workflow graphs to determine if they are DAGs and calculates metrics
 */

import { NextRequest, NextResponse } from 'next/server'
import { WorkflowPayload } from '@/lib/api/workflowApi'
import { analyzeGraph, GraphAnalysisResult } from '@/lib/graph/analyzer'

/**
 * POST /api/workflows/analyze
 * Analyzes a workflow graph and returns analysis results
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate payload structure
    if (!body || !Array.isArray(body.nodes) || !Array.isArray(body.edges)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_PAYLOAD',
            message: 'Invalid payload structure. Expected { nodes: [], edges: [] }',
          },
        },
        { status: 400 }
      )
    }

    // Type assertion (in production, use proper validation library like Zod)
    const payload = body as WorkflowPayload

    // Analyze the graph
    const analysis: GraphAnalysisResult = analyzeGraph(payload.nodes, payload.edges)

    // Return structured response
    return NextResponse.json(
      {
        success: true,
        data: {
          analysis: {
            nodeCount: analysis.nodeCount,
            edgeCount: analysis.edgeCount,
            isDAG: analysis.isDAG,
            hasCycles: analysis.hasCycles,
            connectedComponents: analysis.connectedComponents,
            nodeDegrees: analysis.nodeDegrees,
            ...(analysis.cycles && analysis.cycles.length > 0 && { cycles: analysis.cycles }),
            ...(analysis.topologicallySorted && {
              topologicallySorted: analysis.topologicallySorted,
            }),
          },
          metadata: {
            analyzedAt: new Date().toISOString(),
            workflowVersion: payload.version || 'unknown',
          },
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error analyzing workflow graph:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ANALYSIS_ERROR',
          message:
            error instanceof Error ? error.message : 'An error occurred while analyzing the graph',
          details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
        },
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/workflows/analyze
 * Returns API information
 */
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: 'Workflow Graph Analysis API',
      endpoint: '/api/workflows/analyze',
      method: 'POST',
      payload: {
        nodes: 'Array<WorkflowNodePayload>',
        edges: 'Array<WorkflowEdgePayload>',
      },
      response: {
        success: 'boolean',
        data: {
          analysis: {
            nodeCount: 'number',
            edgeCount: 'number',
            isDAG: 'boolean',
            hasCycles: 'boolean',
            connectedComponents: 'number',
            nodeDegrees: 'Record<string, { inDegree: number, outDegree: number }>',
            cycles: 'string[][] (if hasCycles is true)',
            topologicallySorted: 'string[] (if isDAG is true)',
          },
          metadata: {
            analyzedAt: 'string (ISO date)',
            workflowVersion: 'string',
          },
        },
      },
    },
    { status: 200 }
  )
}
