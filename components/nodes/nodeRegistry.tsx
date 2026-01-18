'use client'

import { useMemo } from 'react'
import { NodeTypes } from 'reactflow'
import BaseNode from './BaseNode'
import TextNode from './TextNode'
import { nodeTypeDefinitions } from './nodeTypes'
import type { BaseNodeData } from './BaseNode'

/**
 * Creates React Flow node types from node type definitions
 * All node types use BaseNode - ensuring consistent structure and styling
 * This eliminates JSX duplication across all node types
 * Special node types (like TextNode) are registered separately
 */
export function createNodeTypes(): NodeTypes {
  const types: NodeTypes = {}

  // Register all predefined node types - all use BaseNode
  Object.values(nodeTypeDefinitions).forEach((definition) => {
    types[definition.type] = (props) => {
      // Merge default data with provided data, ensuring config is included
      const mergedData = {
        ...definition.defaultData,
        ...props.data,
        // Config must be set for BaseNode to work correctly
        config: definition.config,
      }

      // All nodes render through BaseNode - no duplication
      return <BaseNode {...props} data={mergedData} />
    }
  })

  // Register special node types
  types.text = TextNode

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
  // Guard: Validate inputs
  if (!type || typeof type !== 'string') {
    throw new Error('Node type must be a non-empty string')
  }
  if (!id || typeof id !== 'string') {
    throw new Error('Node ID must be a non-empty string')
  }
  if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
    throw new Error('Node position must be an object with x and y numbers')
  }

  const definition = nodeTypeDefinitions[type]
  if (!definition) {
    throw new Error(`Node type "${type}" is not registered`)
  }

  // Guard: Ensure position values are valid
  const safePosition = {
    x: Number.isFinite(position.x) ? position.x : 0,
    y: Number.isFinite(position.y) ? position.y : 0,
  }

  return {
    id,
    type,
    position: safePosition,
    data: {
      ...definition.defaultData,
      ...data,
      config: definition.config,
    },
  }
}
