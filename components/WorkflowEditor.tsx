'use client'

import { useCallback, useState } from 'react'
import ReactFlow, {
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useNodeTypes, createNodeFromType } from './nodes'
import {
  colors,
  shadows,
  spacing,
  typography,
  borderRadius,
  nodeVariants,
} from './nodes/designSystem'
import { handleConfigs } from './nodes/nodeTypes'
import {
  buildWorkflowPayload,
  submitWorkflow,
  validateWorkflowPayload,
  type WorkflowApiResponse,
} from '@/lib/api'
import WorkflowStatisticsAlert, {
  type GraphAnalysisData,
} from './WorkflowStatisticsAlert'

/**
 * Initial workflow nodes - demonstrates configuration-based node creation
 * All nodes except text node use createNodeFromType for consistency
 */
const initialNodes = [
  createNodeFromType('start', '1', { x: 100, y: 100 }, {
    label: 'Start Workflow',
    description: 'Begin processing',
  }),
  createNodeFromType('dataSource', '2', { x: 100, y: 200 }, {
    label: 'External API',
    description: 'Fetch data from API',
  }),
  createNodeFromType('transformer', '3', { x: 100, y: 300 }, {
    label: 'Data Transformer',
    description: 'Transform data format',
  }),
  createNodeFromType('validator', '4', { x: 100, y: 400 }, {
    label: 'Validate Input',
    description: 'Check data validity',
  }),
  createNodeFromType('decision', '5', { x: 300, y: 300 }, {
    label: 'Check Condition',
    description: 'Evaluate result',
  }),
  createNodeFromType('merge', '6', { x: 300, y: 450 }, {
    label: 'Merge Data',
    description: 'Combine multiple sources',
  }),
  createNodeFromType('delay', '7', { x: 500, y: 300 }, {
    label: 'Wait 5s',
    description: 'Pause execution',
  }),
  createNodeFromType('action', '8', { x: 500, y: 450 }, {
    label: 'Execute Action',
    description: 'Perform operation',
  }),
  createNodeFromType('end', '9', { x: 300, y: 600 }, {
    label: 'End Workflow',
    description: 'Complete processing',
  }),
  // Text node - auto-resizing with variable detection
  // Created manually as it requires special handling
  {
    id: '10',
    type: 'text',
    position: { x: 600, y: 100 },
    data: {
      label: 'Text Node',
      text: 'Hello {{name}}, your balance is {{amount}}',
      config: {
        variant: 'info' as const,
        size: 'medium' as const,
        handles: handleConfigs.standard,
      },
    },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
  { id: 'e5-6', source: '5', target: '6' },
  { id: 'e5-7', source: '5', target: '7' },
  { id: 'e6-8', source: '6', target: '8' },
  { id: 'e7-8', source: '7', target: '8' },
  { id: 'e8-9', source: '8', target: '9' },
]

export default function WorkflowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    success: boolean
    message?: string
    error?: string
  } | null>(null)
  const [analysisResult, setAnalysisResult] = useState<GraphAnalysisData | null>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // Get node types from the registry
  const nodeTypes = useNodeTypes()

  // Handle workflow analysis
  const handleAnalyze = useCallback(async () => {
    // Guard: Ensure we have nodes to analyze
    if (!nodes || nodes.length === 0) {
      setSubmitResult({
        success: false,
        error: 'Cannot analyze: workflow must contain at least one node',
      })
      return
    }

    setIsAnalyzing(true)
    setAnalysisResult(null)
    setSubmitResult(null)

    try {
      const payload = buildWorkflowPayload(nodes, edges)
      
      // Guard: Validate payload structure before API call
      if (!payload.nodes || payload.nodes.length === 0) {
        throw new Error('Invalid workflow: no nodes found')
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

      const response = await fetch('/api/workflows/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Analysis failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Guard: Validate response structure
      if (!data || typeof data.success !== 'boolean') {
        throw new Error('Invalid response format from server')
      }

      if (data.success && data.data?.analysis) {
        setAnalysisResult(data.data.analysis)
      } else {
        throw new Error(data.error?.message || 'Failed to analyze workflow')
      }
    } catch (error) {
      let errorMessage = 'Failed to analyze workflow'
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Analysis request timed out. Please try again.'
        } else {
          errorMessage = error.message
        }
      }
      
      setSubmitResult({
        success: false,
        error: errorMessage,
      })
    } finally {
      setIsAnalyzing(false)
    }
  }, [nodes, edges])

  // Handle workflow submission
  const handleSubmit = useCallback(async () => {
    // Guard: Ensure we have nodes to submit
    if (!nodes || nodes.length === 0) {
      setSubmitResult({
        success: false,
        error: 'Cannot submit: workflow must contain at least one node',
      })
      return
    }

    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      // Build payload from current nodes and edges
      const payload = buildWorkflowPayload(nodes, edges || [], {
        name: 'My Workflow',
        createdAt: new Date().toISOString(),
      })

      // Validate payload before submission
      const validation = validateWorkflowPayload(payload)
      if (!validation.valid) {
        setSubmitResult({
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
        })
        setIsSubmitting(false)
        return
      }

      // Submit to API
      const response: WorkflowApiResponse = await submitWorkflow(payload)

      if (response.success) {
        setSubmitResult({
          success: true,
          message: response.data?.message || 'Workflow submitted successfully',
        })
      } else {
        setSubmitResult({
          success: false,
          error: response.error?.message || 'Failed to submit workflow',
        })
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred'
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      setSubmitResult({
        success: false,
        error: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [nodes, edges])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: colors.gray[50],
        fontFamily: typography.fontFamily.sans,
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={{ background: colors.gray[50] }}
      >
        <Controls
          style={{
            background: 'white',
            border: `1px solid ${colors.gray[200]}`,
            borderRadius: borderRadius.md,
            boxShadow: shadows.md,
          }}
        />
        <MiniMap
          style={{
            background: 'white',
            border: `1px solid ${colors.gray[200]}`,
            borderRadius: borderRadius.md,
            boxShadow: shadows.md,
          }}
          nodeColor={(node) => {
            const variant = (node.data?.config?.variant || 'default') as keyof typeof nodeVariants
            return nodeVariants[variant]?.borderColor || colors.gray[300]
          }}
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color={colors.gray[300]}
        />
        <Panel
          position="top-left"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderRadius: borderRadius.lg,
            boxShadow: shadows.lg,
            padding: `${spacing.lg} ${spacing.xl}`,
            maxWidth: '320px',
            border: `1px solid ${colors.gray[200]}`,
          }}
        >
          <h1
            style={{
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.semibold,
              color: colors.gray[900],
              margin: 0,
              marginBottom: spacing.xs,
              lineHeight: typography.lineHeight.tight,
              letterSpacing: '-0.02em',
            }}
          >
            Workflow Editor
          </h1>
          <p
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.gray[600],
              margin: 0,
              marginBottom: spacing.md,
              lineHeight: typography.lineHeight.normal,
            }}
          >
            Drag nodes and connect them to build your workflow
          </p>
          <div
            style={{
              display: 'flex',
              gap: spacing.sm,
              flexDirection: 'column',
            }}
          >
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              style={{
                width: '100%',
                padding: `${spacing.sm} ${spacing.md}`,
                background: isAnalyzing ? colors.gray[400] : colors.info[600],
                color: 'white',
                border: 'none',
                borderRadius: borderRadius.md,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isAnalyzing ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isAnalyzing) {
                  e.currentTarget.style.background = colors.info[700]
                }
              }}
              onMouseLeave={(e) => {
                if (!isAnalyzing) {
                  e.currentTarget.style.background = colors.info[600]
                }
              }}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Workflow'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
            style={{
              width: '100%',
              padding: `${spacing.sm} ${spacing.md}`,
              background: isSubmitting ? colors.gray[400] : colors.primary[600],
              color: 'white',
              border: 'none',
              borderRadius: borderRadius.md,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: isSubmitting ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.background = colors.primary[700]
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.background = colors.primary[600]
              }
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Workflow'}
          </button>
          </div>
          {submitResult && (
            <div
              style={{
                marginTop: spacing.md,
                padding: spacing.sm,
                borderRadius: borderRadius.md,
                background: submitResult.success ? colors.success[50] : colors.error[50],
                border: `1px solid ${submitResult.success ? colors.success[300] : colors.error[300]}`,
                color: submitResult.success ? colors.success[800] : colors.error[800],
                fontSize: typography.fontSize.xs,
                lineHeight: typography.lineHeight.normal,
              }}
            >
              {submitResult.success ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <span>✓</span>
                  <span>{submitResult.message}</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <span>✗</span>
                  <span>{submitResult.error}</span>
                </div>
              )}
            </div>
          )}
        </Panel>

        {/* Workflow Statistics Alert */}
        {analysisResult && (
          <Panel
            position="top-right"
            style={{
              maxWidth: '520px',
              zIndex: 1000,
            }}
          >
            <WorkflowStatisticsAlert
              analysis={analysisResult}
              onClose={() => setAnalysisResult(null)}
            />
          </Panel>
        )}
      </ReactFlow>
    </div>
  )
}
