'use client'

import { useCallback } from 'react'
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

// Example: Creating nodes using the configuration-based system
// Demonstrates both original and new node types
const initialNodes = [
  // Original node types
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

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // Get node types from the registry
  const nodeTypes = useNodeTypes()

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel 
          position="top-left" 
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '12px 16px',
            maxWidth: '300px',
          }}
        >
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
            Workflow Editor
          </h1>
          <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px', margin: 0 }}>
            Drag nodes and connect them to build your workflow
          </p>
        </Panel>
      </ReactFlow>
    </div>
  )
}
