'use client'

import { ReactNode, CSSProperties, useEffect } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import {
  nodeVariants,
  nodeSizes,
  shadows,
  borderRadius,
  handleStyles,
  contentStyles as designContentStyles,
} from './designSystem'

export interface BaseNodeData {
  label: string
  description?: string
  icon?: ReactNode
  status?: 'idle' | 'running' | 'success' | 'error'
  metadata?: Record<string, any>
}

export interface BaseNodeConfig {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'small' | 'medium' | 'large'
  showHandles?: boolean
  handles?: {
    source?: boolean | Position[]
    target?: boolean | Position[]
  }
  customStyles?: CSSProperties
  customContent?: (data: BaseNodeData) => ReactNode
}

export interface BaseNodeProps extends NodeProps {
  data: BaseNodeData & {
    config?: BaseNodeConfig
  }
}

const statusStyles = {
  idle: { opacity: 1 },
  running: {
    opacity: 1,
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  success: { opacity: 1 },
  error: { opacity: 1 },
}

export default function BaseNode({ data, selected }: BaseNodeProps) {
  const config = data.config || {}
  const {
    variant = 'default',
    size = 'medium',
    showHandles = true,
    handles = { source: true, target: true },
    customStyles = {},
    customContent,
  } = config

  const variantStyle = nodeVariants[variant]
  const sizeStyle = nodeSizes[size]
  const statusStyle = statusStyles[data.status || 'idle']

  const baseStyle: CSSProperties = {
    ...variantStyle,
    ...sizeStyle,
    ...statusStyle,
    ...customStyles,
    borderRadius: borderRadius.md,
    boxShadow: selected ? shadows.selected : shadows.md,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    transform: 'scale(1)',
  }

  // Helper to render handles of a specific type
  const renderHandleGroup = (
    handleType: 'source' | 'target',
    handleConfig: boolean | Position[] | undefined,
    defaultPosition: Position
  ): ReactNode[] => {
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

  const renderHandles = () => {
    if (!showHandles) return null

    const sourceHandles = renderHandleGroup('source', handles.source, Position.Bottom)
    const targetHandles = renderHandleGroup('target', handles.target, Position.Top)

    return [...targetHandles, ...sourceHandles]
  }

  const renderContent = () => {
    if (customContent) {
      return customContent(data)
    }

    // Standard content rendering - all nodes share this structure
    return (
      <div style={designContentStyles.container}>
        {data.icon && (
          <div style={designContentStyles.iconContainer}>{data.icon}</div>
        )}
        <div style={{ ...designContentStyles.label, color: variantStyle.color }}>
          {data.label}
        </div>
        {data.description && (
          <div style={{ ...designContentStyles.description, color: variantStyle.color }}>
            {data.description}
          </div>
        )}
        {data.status && data.status !== 'idle' && (
          <div style={designContentStyles.statusBadge}>{data.status}</div>
        )}
      </div>
    )
  }

  // Add animation style to document if not already added
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('node-pulse-animation')) {
      const style = document.createElement('style')
      style.id = 'node-pulse-animation'
      style.textContent = `
        @keyframes node-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const runningStyle: CSSProperties =
    data.status === 'running'
      ? {
          animation: 'node-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }
      : {}

  return (
    <div
      style={{ ...baseStyle, ...runningStyle }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.boxShadow = shadows.lg
          e.currentTarget.style.transform = 'scale(1.02)'
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.boxShadow = shadows.md
          e.currentTarget.style.transform = 'scale(1)'
        }
      }}
    >
      {renderHandles()}
      {renderContent()}
    </div>
  )
}
