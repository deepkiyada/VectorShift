/**
 * Design System Tokens
 * Provides consistent spacing, typography, colors, and visual elements
 * across all workflow editor components
 */

// Spacing Scale (8px base unit)
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
} as const

// Typography Scale
export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    md: '15px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const

// Color Palette - Professional, accessible colors
export const colors = {
  // Neutral grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  // Primary blue
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Success green
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  // Warning amber
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  // Error red
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  // Info cyan
  info: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
} as const

// Shadow System
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  xl: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  focus: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  selected: '0 0 0 2px #3b82f6, 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
} as const

// Border Radius
export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const

// Node Variant Styles - Professional, cohesive design
export const nodeVariants = {
  default: {
    border: `1px solid ${colors.gray[300]}`,
    background: colors.gray[50],
    color: colors.gray[800],
    borderColor: colors.gray[300],
  },
  primary: {
    border: `1.5px solid ${colors.primary[500]}`,
    background: colors.primary[50],
    color: colors.primary[800],
    borderColor: colors.primary[500],
  },
  success: {
    border: `1.5px solid ${colors.success[500]}`,
    background: colors.success[50],
    color: colors.success[800],
    borderColor: colors.success[500],
  },
  warning: {
    border: `1.5px solid ${colors.warning[500]}`,
    background: colors.warning[50],
    color: colors.warning[800],
    borderColor: colors.warning[500],
  },
  error: {
    border: `1.5px solid ${colors.error[500]}`,
    background: colors.error[50],
    color: colors.error[800],
    borderColor: colors.error[500],
  },
  info: {
    border: `1.5px solid ${colors.info[500]}`,
    background: colors.info[50],
    color: colors.info[800],
    borderColor: colors.info[500],
  },
} as const

// Node Size Styles - Consistent spacing and typography
export const nodeSizes = {
  small: {
    minWidth: '140px',
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: typography.fontSize.sm,
  },
  medium: {
    minWidth: '180px',
    padding: `${spacing.md} ${spacing.lg}`,
    fontSize: typography.fontSize.base,
  },
  large: {
    minWidth: '220px',
    padding: `${spacing.lg} ${spacing.xl}`,
    fontSize: typography.fontSize.md,
  },
} as const

// Handle Styles
export const handleStyles = {
  size: '10px',
  border: '2px solid white',
  borderRadius: borderRadius.full,
} as const

// Content Styles
export const contentStyles = {
  container: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: spacing.xs,
  },
  iconContainer: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.xs,
  },
  label: {
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: '-0.01em',
  },
  description: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.normal,
    opacity: 0.75,
    marginTop: '2px',
  },
  statusBadge: {
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.sm,
    background: 'rgba(0, 0, 0, 0.04)',
    display: 'inline-block' as const,
    textTransform: 'uppercase' as const,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: '0.05em',
  },
} as const
