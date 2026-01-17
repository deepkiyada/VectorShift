'use client'

import { ReactNode, CSSProperties, useEffect } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'

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

const variantStyles = {
  default: {
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    color: '#1f2937',
  },
  primary: {
    border: '1px solid #3b82f6',
    background: '#eff6ff',
    color: '#1e40af',
  },
  success: {
    border: '1px solid #10b981',
    background: '#ecfdf5',
    color: '#065f46',
  },
  warning: {
    border: '1px solid #f59e0b',
    background: '#fffbeb',
    color: '#92400e',
  },
  error: {
    border: '1px solid #ef4444',
    background: '#fef2f2',
    color: '#991b1b',
  },
  info: {
    border: '1px solid #06b6d4',
    background: '#ecfeff',
    color: '#164e63',
  },
}

const sizeStyles = {
  small: {
    minWidth: '120px',
    padding: '8px 12px',
    fontSize: '12px',
  },
  medium: {
    minWidth: '160px',
    padding: '12px 16px',
    fontSize: '14px',
  },
  large: {
    minWidth: '200px',
    padding: '16px 20px',
    fontSize: '16px',
  },
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

// Shared content styles - extracted to avoid duplication
const contentStyles = {
  container: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '4px',
  },
  iconContainer: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    marginBottom: '4px',
  },
  label: {
    fontWeight: 600,
    lineHeight: '1.4' as const,
  },
  description: {
    fontSize: '12px',
    opacity: 0.7,
    lineHeight: '1.3' as const,
  },
  statusBadge: {
    fontSize: '10px',
    marginTop: '4px',
    padding: '2px 6px',
    borderRadius: '4px',
    background: 'rgba(0, 0, 0, 0.05)',
    display: 'inline-block' as const,
    textTransform: 'uppercase' as const,
    fontWeight: 500,
  },
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

  const variantStyle = variantStyles[variant]
  const sizeStyle = sizeStyles[size]
  const statusStyle = statusStyles[data.status || 'idle']

  const baseStyle: CSSProperties = {
    ...variantStyle,
    ...sizeStyle,
    ...statusStyle,
    ...customStyles,
    borderRadius: '8px',
    boxShadow: selected
      ? '0 0 0 2px #3b82f6, 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      : '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    position: 'relative',
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
      background: variantStyle.border,
      width: '8px',
      height: '8px',
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
      <div style={contentStyles.container}>
        {data.icon && (
          <div style={contentStyles.iconContainer}>{data.icon}</div>
        )}
        <div style={{ ...contentStyles.label, color: variantStyle.color }}>
          {data.label}
        </div>
        {data.description && (
          <div style={{ ...contentStyles.description, color: variantStyle.color }}>
            {data.description}
          </div>
        )}
        {data.status && data.status !== 'idle' && (
          <div style={contentStyles.statusBadge}>{data.status}</div>
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
    <div style={{ ...baseStyle, ...runningStyle }}>
      {renderHandles()}
      {renderContent()}
    </div>
  )
}
