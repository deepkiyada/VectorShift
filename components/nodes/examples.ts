/**
 * Examples demonstrating how to easily add new node types
 * All examples use BaseNode through configuration - no JSX duplication
 * This shows the power of the configuration-based approach
 */

import { createNodeType, registerNodeType } from './nodeTypes'
import { Position } from 'reactflow'

// Example 1: Simple custom node type
export const customApiNode = createNodeType(
  'api',
  {
    variant: 'info',
    size: 'medium',
    handles: {
      source: [Position.Bottom],
      target: [Position.Top],
    },
    customStyles: {
      borderLeft: '4px solid #06b6d4',
    },
  },
  {
    label: 'API Call',
    description: 'Fetch data from API',
  }
)

// Example 2: Node with custom icon (you would pass ReactNode for icon in data)
export const databaseNode = createNodeType(
  'database',
  {
    variant: 'primary',
    size: 'large',
    handles: {
      source: [Position.Bottom, Position.Right],
      target: [Position.Top, Position.Left],
    },
  },
  {
    label: 'Database',
    description: 'Read or write to database',
  }
)

// Example 3: Specialized node with custom shape
export const triggerNode = createNodeType(
  'trigger',
  {
    variant: 'success',
    size: 'small',
    handles: {
      source: [Position.Bottom],
      target: false,
    },
    customStyles: {
      borderRadius: '20px',
      fontWeight: 600,
    },
  },
  {
    label: 'Trigger',
    description: 'Event trigger',
  }
)

// Example 4: Node with multiple output handles
export const splitterNode = createNodeType(
  'splitter',
  {
    variant: 'warning',
    size: 'medium',
    handles: {
      source: [Position.Bottom, Position.Left, Position.Right],
      target: [Position.Top],
    },
    customStyles: {
      borderTop: '3px solid #f59e0b',
    },
  },
  {
    label: 'Split',
    description: 'Split data flow',
  }
)

// Register all example node types
export function registerExampleNodeTypes() {
  registerNodeType(customApiNode)
  registerNodeType(databaseNode)
  registerNodeType(triggerNode)
  registerNodeType(splitterNode)
}

/**
 * Usage example:
 * 
 * // In your component or initialization file:
 * import { registerExampleNodeTypes } from './nodes/examples'
 * registerExampleNodeTypes()
 * 
 * // Then create nodes using:
 * import { createNodeFromType } from './nodes'
 * const apiNode = createNodeFromType('api', 'node-1', { x: 100, y: 100 })
 * const dbNode = createNodeFromType('database', 'node-2', { x: 200, y: 200 }, {
 *   label: 'PostgreSQL',
 *   description: 'Production database',
 * })
 */
