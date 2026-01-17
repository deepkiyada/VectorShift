import { BaseNodeConfig, BaseNodeData } from './BaseNode'
import { Position } from 'reactflow'

export interface NodeTypeDefinition {
  type: string
  config: BaseNodeConfig
  defaultData?: Partial<BaseNodeData>
}

// Common handle configurations
export const handleConfigs = {
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
  multipleInputs: {
    source: [Position.Bottom] as Position[],
    target: [Position.Top, Position.Left, Position.Right] as Position[],
  },
  multipleOutputs: {
    source: [Position.Bottom, Position.Left, Position.Right] as Position[],
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
  // Additional node types demonstrating extensibility
  dataSource: {
    type: 'dataSource',
    config: {
      variant: 'primary',
      size: 'large',
      handles: handleConfigs.input,
      customStyles: {
        borderLeft: '4px solid #3b82f6',
      },
    },
    defaultData: {
      label: 'Data Source',
      description: 'External data input',
    },
  },
  transformer: {
    type: 'transformer',
    config: {
      variant: 'default',
      size: 'medium',
      handles: handleConfigs.standard,
      customStyles: {
        borderTop: '3px solid #6366f1',
        background: 'linear-gradient(to bottom, #f8fafc, #ffffff)',
      },
    },
    defaultData: {
      label: 'Transformer',
      description: 'Transform data format',
    },
  },
  validator: {
    type: 'validator',
    config: {
      variant: 'warning',
      size: 'small',
      handles: handleConfigs.standard,
      customStyles: {
        borderRadius: '12px',
        fontWeight: 600,
      },
    },
    defaultData: {
      label: 'Validator',
      description: 'Validate data',
    },
  },
  merge: {
    type: 'merge',
    config: {
      variant: 'info',
      size: 'medium',
      handles: handleConfigs.multipleInputs,
      customStyles: {
        borderTop: '2px dashed #06b6d4',
      },
    },
    defaultData: {
      label: 'Merge',
      description: 'Combine multiple inputs',
    },
  },
  delay: {
    type: 'delay',
    config: {
      variant: 'default',
      size: 'small',
      handles: handleConfigs.standard,
      customStyles: {
        border: '2px dashed #9ca3af',
        background: '#f9fafb',
        fontStyle: 'italic',
      },
    },
    defaultData: {
      label: 'Delay',
      description: 'Wait or pause',
    },
  },
  // Text node - auto-resizing text-based node
  // Note: This uses TextNode component, not BaseNode
  // Text property is handled by TextNode component, not in defaultData
  text: {
    type: 'text',
    config: {
      variant: 'default',
      size: 'medium',
      handles: handleConfigs.standard,
    },
    defaultData: {
      label: 'Text Node',
      description: 'Editable text content',
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
