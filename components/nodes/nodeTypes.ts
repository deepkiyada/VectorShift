import { BaseNodeConfig, BaseNodeData } from './BaseNode'
import { Position } from 'reactflow'

export interface NodeTypeDefinition {
  type: string
  config: BaseNodeConfig
  defaultData?: Partial<BaseNodeData>
}

// Common handle configurations
const handleConfigs = {
  input: {
    source: [Position.Bottom] as Position[],
    target: false,
  },
  output: {
    source: false,
    target: [Position.Top] as Position[],
  },
  standard: {
    source: [Position.Bottom] as Position[],
    target: [Position.Top] as Position[],
  },
  decision: {
    source: [Position.Bottom, Position.Right] as Position[],
    target: [Position.Top] as Position[],
  },
} as const

// Predefined node type configurations
// All nodes use BaseNode through the registry - no JSX duplication
export const nodeTypeDefinitions: Record<string, NodeTypeDefinition> = {
  start: {
    type: 'start',
    config: {
      variant: 'success',
      size: 'medium',
      handles: handleConfigs.input,
    },
    defaultData: {
      label: 'Start',
      description: 'Workflow entry point',
    },
  },
  end: {
    type: 'end',
    config: {
      variant: 'error',
      size: 'medium',
      handles: handleConfigs.output,
    },
    defaultData: {
      label: 'End',
      description: 'Workflow exit point',
    },
  },
  process: {
    type: 'process',
    config: {
      variant: 'primary',
      size: 'medium',
      handles: handleConfigs.standard,
    },
    defaultData: {
      label: 'Process',
      description: 'Processing step',
    },
  },
  decision: {
    type: 'decision',
    config: {
      variant: 'warning',
      size: 'medium',
      handles: handleConfigs.decision,
      customStyles: {
        borderRadius: '50%',
        minWidth: '120px',
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    defaultData: {
      label: 'Decision',
      description: 'Conditional branch',
    },
  },
  action: {
    type: 'action',
    config: {
      variant: 'info',
      size: 'medium',
      handles: handleConfigs.standard,
    },
    defaultData: {
      label: 'Action',
      description: 'Execute action',
    },
  },
}

// Helper function to create a node type definition
export function createNodeType(
  type: string,
  config: BaseNodeConfig,
  defaultData?: Partial<BaseNodeData>
): NodeTypeDefinition {
  return {
    type,
    config,
    defaultData,
  }
}

// Helper function to register a new node type
export function registerNodeType(definition: NodeTypeDefinition) {
  nodeTypeDefinitions[definition.type] = definition
}

// Helper function to get node type definition
export function getNodeTypeDefinition(type: string): NodeTypeDefinition | undefined {
  return nodeTypeDefinitions[type]
}
