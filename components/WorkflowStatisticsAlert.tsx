'use client'

import { CSSProperties } from 'react'
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from './nodes/designSystem'

export interface GraphAnalysisData {
  nodeCount: number
  edgeCount: number
  isDAG: boolean
  hasCycles: boolean
  connectedComponents?: number
  nodeDegrees?: {
    [nodeId: string]: {
      inDegree: number
      outDegree: number
    }
  }
  cycles?: string[][]
  topologicallySorted?: string[]
}

export interface WorkflowStatisticsAlertProps {
  analysis: GraphAnalysisData
  onClose?: () => void
}

export default function WorkflowStatisticsAlert({
  analysis,
  onClose,
}: WorkflowStatisticsAlertProps) {
  const { isDAG, hasCycles, nodeCount, edgeCount, connectedComponents, cycles, topologicallySorted } =
    analysis

  // Determine alert variant based on analysis results
  const variant = isDAG ? 'success' : 'warning'
  const variantColors = isDAG
    ? {
        background: colors.success[50],
        border: colors.success[300],
        icon: colors.success[600],
        text: colors.success[900],
      }
    : {
        background: colors.warning[50],
        border: colors.warning[300],
        icon: colors.warning[600],
        text: colors.warning[900],
      }

  const containerStyle: CSSProperties = {
    background: variantColors.background,
    border: `2px solid ${variantColors.border}`,
    borderRadius: borderRadius.lg,
    padding: `${spacing.lg} ${spacing.xl}`,
    boxShadow: shadows.lg,
    maxWidth: '480px',
    position: 'relative',
  }

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  }

  const titleStyle: CSSProperties = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: variantColors.text,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  }

  const closeButtonStyle: CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: variantColors.text,
    fontSize: typography.fontSize.xl,
    cursor: 'pointer',
    padding: spacing.xs,
    lineHeight: 1,
    opacity: 0.6,
    transition: 'opacity 0.2s',
  }

  const statGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: spacing.md,
    marginBottom: spacing.md,
  }

  const statItemStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  }

  const statLabelStyle: CSSProperties = {
    fontSize: typography.fontSize.xs,
    color: variantColors.text,
    opacity: 0.7,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }

  const statValueStyle: CSSProperties = {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: variantColors.text,
    lineHeight: typography.lineHeight.tight,
  }

  const statusBadgeStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: borderRadius.md,
    background: variantColors.border,
    color: variantColors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
  }

  const detailsSectionStyle: CSSProperties = {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTop: `1px solid ${variantColors.border}`,
  }

  const detailsTitleStyle: CSSProperties = {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: variantColors.text,
    marginBottom: spacing.sm,
  }

  const cyclesListStyle: CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  }

  const cycleItemStyle: CSSProperties = {
    padding: `${spacing.xs} ${spacing.sm}`,
    background: colors.error[100],
    color: colors.error[900],
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.mono,
    marginBottom: spacing.xs,
    border: `1px solid ${colors.error[300]}`,
  }

  const topoListStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    padding: spacing.sm,
    background: colors.success[100],
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.success[300]}`,
  }

  const topoItemStyle: CSSProperties = {
    padding: `${spacing.xs} ${spacing.sm}`,
    background: colors.success[200],
    color: colors.success[900],
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.mono,
    fontWeight: typography.fontWeight.medium,
  }

  const arrowStyle: CSSProperties = {
    color: variantColors.text,
    opacity: 0.5,
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          <span>{isDAG ? '✓' : '⚠'}</span>
          <span>Workflow Analysis</span>
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            style={closeButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>

      {/* Status Badge */}
      <div style={statusBadgeStyle}>
        <span>{isDAG ? '✓ Valid DAG' : '⚠ Contains Cycles'}</span>
      </div>

      {/* Statistics Grid */}
      <div style={statGridStyle}>
        <div style={statItemStyle}>
          <div style={statLabelStyle}>Nodes</div>
          <div style={statValueStyle}>{nodeCount}</div>
        </div>
        <div style={statItemStyle}>
          <div style={statLabelStyle}>Edges</div>
          <div style={statValueStyle}>{edgeCount}</div>
        </div>
        {connectedComponents !== undefined && (
          <div style={statItemStyle}>
            <div style={statLabelStyle}>Components</div>
            <div style={statValueStyle}>{connectedComponents}</div>
          </div>
        )}
        <div style={statItemStyle}>
          <div style={statLabelStyle}>Type</div>
          <div
            style={{
              ...statValueStyle,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
            }}
          >
            {isDAG ? 'DAG' : 'Cyclic'}
          </div>
        </div>
      </div>

      {/* Additional Details */}
      {(hasCycles || topologicallySorted) && (
        <div style={detailsSectionStyle}>
          {hasCycles && cycles && cycles.length > 0 && (
            <div style={{ marginBottom: spacing.md }}>
              <div style={detailsTitleStyle}>⚠️ Cycles Detected:</div>
              <ul style={cyclesListStyle}>
                {cycles.map((cycle, index) => (
                  <li key={index} style={cycleItemStyle}>
                    {cycle.join(' → ')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {topologicallySorted && topologicallySorted.length > 0 && (
            <div>
              <div style={detailsTitleStyle}>✓ Execution Order (Topological Sort):</div>
              <div style={topoListStyle}>
                {topologicallySorted.map((nodeId, index) => (
                  <span key={nodeId}>
                    {index > 0 && <span style={arrowStyle}> → </span>}
                    <span style={topoItemStyle}>{nodeId}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
