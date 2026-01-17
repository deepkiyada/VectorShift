'use client'

import { useMemo } from 'react'
import { NodeTypes } from 'reactflow'
import BaseNode from './BaseNode'
import { nodeTypeDefinitions } from './nodeTypes'
import { BaseNodeData } from './BaseNode'

/**
 * Creates React Flow node types from node type definitions
 * This allows us to register node types by configuration
 */
export function createNodeTypes(): NodeTypes {
  const types: NodeTypes = {}

  // Register all predefined node types
  Object.values(nodeTypeDefinitions).forEach((definition) => {
    types[definition.type] = (props) => {
      // Merge default data with provided data
      const mergedData = {
        ...definition.defaultData,
        ...props.data,
        config: definition.config,
      }

      return <BaseNode {...props} data={mergedData} />
    }
  })

  return types
}

/**
 * Hook to get node types for React Flow
 */
export function useNodeTypes(): NodeTypes {
  return useMemo(() => createNodeTypes(), [])
}

/**
 * Helper to create a node instance from a type definition
 */
export function createNodeFromType(
  type: string,
  id: string,
  position: { x: number; y: number },
  data?: Partial<BaseNodeData>
) {
  const definition = nodeTypeDefinitions[type]
  if (!definition) {
    throw new Error(`Node type "${type}" is not registered`)
  }

  return {
    id,
    type,
    position,
    data: {
      ...definition.defaultData,
      ...data,
      config: definition.config,
    },
  }
}
