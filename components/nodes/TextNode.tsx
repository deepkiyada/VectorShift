'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow'
import {
  nodeVariants,
  nodeSizes,
  shadows,
  borderRadius,
  handleStyles,
  spacing,
  typography,
  colors,
} from './designSystem'
import { BaseNodeData, BaseNodeConfig } from './BaseNode'

export interface TextNodeData extends BaseNodeData {
  text?: string
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

export interface TextNodeProps extends NodeProps {
  data: TextNodeData & {
    config?: BaseNodeConfig
  }
}

// Minimum and maximum dimensions
const MIN_WIDTH = 180
const MIN_HEIGHT = 80
const MAX_WIDTH = 400
const MAX_HEIGHT = 300
const PADDING_X = 16
const PADDING_Y = 12
const LINE_HEIGHT = 1.5

// Regex to match {{variableName}} pattern
// Matches: {{variable}}, {{variable_name}}, {{variableName123}}
// Does not match nested braces or invalid patterns
const VARIABLE_REGEX = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g

// Extract unique variable names from text
function extractVariables(text: string): string[] {
  const matches = Array.from(text.matchAll(VARIABLE_REGEX))
  const variables = matches.map((match) => match[1])
  // Return unique variables, preserving order
  return Array.from(new Set(variables))
}

export default function TextNode({ data, selected, id }: TextNodeProps) {
  const { setNodes } = useReactFlow()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [text, setText] = useState(data.text || '')
  const [dimensions, setDimensions] = useState({ width: MIN_WIDTH, height: MIN_HEIGHT })
  const [detectedVariables, setDetectedVariables] = useState<string[]>([])

  const config = data.config || {}
  const {
    variant = 'default',
    size = 'medium',
    showHandles = true,
    handles = { source: true, target: true },
  } = config

  const variantStyle = nodeVariants[variant]
  const sizeStyle = nodeSizes[size]

  // Calculate dimensions based on text content
  const calculateDimensions = useCallback(() => {
    if (!measureRef.current) return { width: MIN_WIDTH, height: MIN_HEIGHT }

    const measure = measureRef.current
    const currentText = text || ' '

    // Set text in measure element
    measure.textContent = currentText
    measure.style.width = `${MIN_WIDTH - PADDING_X * 2}px`

    // Get computed dimensions
    const scrollWidth = measure.scrollWidth
    const scrollHeight = measure.scrollHeight

    // Calculate width (with constraints)
    const contentWidth = scrollWidth + PADDING_X * 2
    const width = Math.max(
      MIN_WIDTH,
      Math.min(MAX_WIDTH, contentWidth)
    )

    // Calculate height (with constraints)
    const contentHeight = scrollHeight + PADDING_Y * 2
    const height = Math.max(
      MIN_HEIGHT,
      Math.min(MAX_HEIGHT, contentHeight)
    )

    return { width, height }
  }, [text])

  // Update node dimensions in React Flow
  const updateDimensions = useCallback(() => {
    const newDimensions = calculateDimensions()
    setDimensions(newDimensions)

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            width: newDimensions.width,
            height: newDimensions.height,
            data: {
              ...node.data,
              text,
            },
          }
        }
        return node
      })
    )
  }, [id, calculateDimensions, setNodes, text])

  // Handle text change
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value
      setText(newText)
      // Dimensions will update via useEffect when text state changes
    },
    []
  )

  // Update dimensions when text changes (with smooth animation)
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      updateDimensions()
    })
    return () => cancelAnimationFrame(rafId)
  }, [text, updateDimensions])

  // Detect variables when text changes
  useEffect(() => {
    const variables = extractVariables(text)
    setDetectedVariables(variables)
  }, [text])

  // Update when text changes externally
  useEffect(() => {
    if (data.text !== undefined && data.text !== text) {
      setText(data.text)
    }
  }, [data.text, text])

  // Helper to render handles
  const renderHandleGroup = (
    handleType: 'source' | 'target',
    handleConfig: boolean | Position[] | undefined,
    defaultPosition: Position
  ) => {
    if (!handleConfig) return []

    const positions = Array.isArray(handleConfig) ? handleConfig : [defaultPosition]
    const handleStyle = {
      background: variantStyle.borderColor,
      width: handleStyles.size,
      height: handleStyles.size,
      border: handleStyles.border,
      borderRadius: handleStyles.borderRadius,
    }

    return positions.map((position) => (
      <Handle
        key={`${handleType}-${position}`}
        type={handleType}
        position={position}
        style={handleStyle}
      />
    ))
  }

  // Render variable input handles (target handles on the left)
  const renderVariableHandles = (): React.ReactElement[] => {
    if (!showHandles || detectedVariables.length === 0) return []

    const handleStyle = {
      background: variantStyle.borderColor,
      width: handleStyles.size,
      height: handleStyles.size,
      border: handleStyles.border,
      borderRadius: handleStyles.borderRadius,
    }

    // Distribute handles vertically on the left side
    // React Flow handles use percentage-based positioning
    return detectedVariables.map((variable, index) => {
      const position = Position.Left
      // Calculate position as percentage from top (distributed evenly)
      const topPercent = ((index + 1) / (detectedVariables.length + 1)) * 100
      
      return (
        <Handle
          key={`variable-${variable}`}
          id={`variable-${variable}`}
          type="target"
          position={position}
          style={{
            ...handleStyle,
            top: `${topPercent}%`,
          }}
          data-variable={variable}
        />
      )
    })
  }

  const renderHandles = () => {
    if (!showHandles) return null

    const sourceHandles = renderHandleGroup('source', handles.source, Position.Bottom)
    // Only render default target handles if no variables are detected
    // Variable handles replace default target handles
    const targetHandles = detectedVariables.length === 0
      ? renderHandleGroup('target', handles.target, Position.Top)
      : []

    return [...targetHandles, ...sourceHandles, ...renderVariableHandles()]
  }

  const baseStyle: React.CSSProperties = {
    ...variantStyle,
    borderRadius: borderRadius.md,
    boxShadow: selected ? shadows.selected : shadows.md,
    transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1), height 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'text',
    position: 'relative',
    fontFamily: typography.fontFamily.sans,
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    minWidth: `${MIN_WIDTH}px`,
    minHeight: `${MIN_HEIGHT}px`,
    maxWidth: `${MAX_WIDTH}px`,
    maxHeight: `${MAX_HEIGHT}px`,
    padding: `${PADDING_Y}px ${PADDING_X}px`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    border: 'none',
    background: 'transparent',
    color: variantStyle.color,
    fontSize: typography.fontSize.base,
    lineHeight: LINE_HEIGHT,
    fontFamily: typography.fontFamily.sans,
    resize: 'none',
    outline: 'none',
    overflow: 'hidden',
    padding: 0,
    margin: 0,
    flex: 1,
  }

  const measureStyle: React.CSSProperties = {
    position: 'absolute',
    visibility: 'hidden',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
    fontSize: typography.fontSize.base,
    lineHeight: LINE_HEIGHT,
    fontFamily: typography.fontFamily.sans,
    padding: 0,
    margin: 0,
    border: 'none',
    width: `${MIN_WIDTH - PADDING_X * 2}px`,
    top: '-9999px',
    left: '-9999px',
  }

  return (
    <div style={baseStyle}>
      {renderHandles()}
      {/* Hidden measure element for calculating dimensions */}
      <div ref={measureRef} style={measureStyle} aria-hidden="true" />
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text... Use {{variable}} syntax for inputs"
        style={textareaStyle}
        rows={1}
      />
    </div>
  )
}
