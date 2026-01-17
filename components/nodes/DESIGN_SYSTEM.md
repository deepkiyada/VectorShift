# Design System Documentation

## Overview

A cohesive, professional design system ensures consistent spacing, typography, colors, and visual hierarchy across all workflow editor components. This system prioritizes clarity and usability over visual complexity.

## Design Principles

1. **Consistency**: All nodes share the same design language
2. **Clarity**: Clear visual hierarchy and readable typography
3. **Usability**: Intuitive interactions and clear affordances
4. **Accessibility**: Sufficient contrast and readable text sizes
5. **Professionalism**: Clean, modern aesthetic suitable for enterprise use

## Design Tokens

### Spacing Scale
Based on an 8px grid system for consistent alignment:

```typescript
xs: '4px'   // Tight spacing
sm: '8px'   // Small spacing
md: '12px'  // Medium spacing
lg: '16px'  // Large spacing
xl: '20px'  // Extra large spacing
2xl: '24px' // Double extra large
3xl: '32px' // Triple extra large
```

### Typography

**Font Family**: System font stack for optimal performance
- Primary: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Monospace: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace`

**Font Sizes**:
- `xs`: 11px - Status badges, metadata
- `sm`: 12px - Descriptions, secondary text
- `base`: 14px - Standard node content
- `md`: 15px - Large nodes
- `lg`: 16px - Headings
- `xl`: 18px - Section headings
- `2xl`: 20px - Page titles

**Font Weights**:
- `normal`: 400 - Body text
- `medium`: 500 - Status badges
- `semibold`: 600 - Labels, headings
- `bold`: 700 - Emphasis

**Line Heights**:
- `tight`: 1.2 - Headings
- `normal`: 1.4 - Body text
- `relaxed`: 1.6 - Long-form content

### Color Palette

#### Neutral Grays
- `gray[50]`: Background surfaces
- `gray[100]`: Subtle backgrounds
- `gray[200]`: Borders, dividers
- `gray[300]`: Disabled states
- `gray[400]`: Placeholder text
- `gray[500]`: Secondary text
- `gray[600]`: Body text
- `gray[700]`: Headings
- `gray[800]`: Primary text
- `gray[900]`: High contrast text

#### Semantic Colors
Each semantic color (primary, success, warning, error, info) has a 9-shade scale from 50-900, providing:
- Light backgrounds (50-100)
- Medium accents (400-600)
- Dark text (700-900)

### Shadows

```typescript
sm: Subtle elevation
md: Standard elevation (default nodes)
lg: Prominent elevation (panels)
xl: High elevation
focus: Focus ring
selected: Selected node indicator
```

### Border Radius

```typescript
sm: '6px'   - Small elements
md: '8px'   - Standard nodes (default)
lg: '12px'  - Large elements
xl: '16px'  - Panels
full: '9999px' - Circular elements
```

## Node Variants

All variants use consistent styling with semantic color meanings:

### Default
- **Use**: Standard operations, neutral actions
- **Color**: Gray tones
- **Border**: 1px solid gray-300
- **Background**: gray-50

### Primary
- **Use**: Important data sources, primary actions
- **Color**: Blue tones
- **Border**: 1.5px solid primary-500
- **Background**: primary-50

### Success
- **Use**: Start nodes, successful operations
- **Color**: Green tones
- **Border**: 1.5px solid success-500
- **Background**: success-50

### Warning
- **Use**: Validation, conditional checks
- **Color**: Amber/orange tones
- **Border**: 1.5px solid warning-500
- **Background**: warning-50

### Error
- **Use**: End nodes, error states
- **Color**: Red tones
- **Border**: 1.5px solid error-500
- **Background**: error-50

### Info
- **Use**: Information processing, data operations
- **Color**: Cyan tones
- **Border**: 1.5px solid info-500
- **Background**: info-50

## Node Sizes

### Small
- **Min Width**: 140px
- **Padding**: 8px 12px
- **Font Size**: 12px
- **Use**: Compact operations, validators, delays

### Medium (Default)
- **Min Width**: 180px
- **Padding**: 12px 16px
- **Font Size**: 14px
- **Use**: Standard workflow nodes

### Large
- **Min Width**: 220px
- **Padding**: 16px 20px
- **Font Size**: 15px
- **Use**: Important data sources, prominent operations

## Visual Hierarchy

### Node Structure
1. **Border**: Defines node boundary, uses variant color
2. **Background**: Light tint of variant color
3. **Label**: Semibold, primary text color
4. **Description**: Smaller, reduced opacity
5. **Status Badge**: Uppercase, subtle background

### Interaction States
- **Default**: Medium shadow, standard border
- **Selected**: Blue focus ring, enhanced shadow
- **Hover**: Smooth transitions (0.2s ease)
- **Running**: Subtle pulse animation

## Handle Design

- **Size**: 10px diameter
- **Border**: 2px solid white (for contrast)
- **Shape**: Circular (full border radius)
- **Color**: Matches node variant border color
- **Interaction**: Scales to 1.2x on hover

## Editor Styling

### Background
- **Color**: gray-50 (subtle, non-distracting)
- **Pattern**: Dotted grid (16px gap)
- **Dot Color**: gray-300

### Controls & Panels
- **Background**: White with 95% opacity
- **Border**: 1px solid gray-200
- **Shadow**: Large shadow for depth
- **Backdrop**: Blur effect for modern look
- **Border Radius**: Large (12px) for soft appearance

### Edges
- **Default**: gray-500, 2px width
- **Selected**: primary-500, 3px width
- **Smooth**: Curved paths for clarity

## Accessibility

### Contrast Ratios
- Text on backgrounds: Minimum 4.5:1 (WCAG AA)
- Interactive elements: Minimum 3:1
- Focus indicators: High contrast (blue on white)

### Typography
- Minimum font size: 11px (status badges)
- Standard font size: 14px (body text)
- Line height: 1.4 minimum for readability

### Interactive Elements
- Minimum touch target: 44x44px
- Clear hover states
- Visible focus indicators

## Usage Examples

### Creating a Node with Design System

```typescript
import { createNodeType } from './nodeTypes'
import { colors, spacing, typography } from './designSystem'

const myNode = createNodeType(
  'myNode',
  {
    variant: 'primary',
    size: 'medium',
    customStyles: {
      // Use design tokens
      padding: `${spacing.lg} ${spacing.xl}`,
      borderRadius: borderRadius.lg,
    },
  },
  {
    label: 'My Node',
    description: 'Uses design system',
  }
)
```

## Benefits

1. **Consistency**: All components share the same visual language
2. **Maintainability**: Changes to tokens affect all components
3. **Scalability**: Easy to add new variants or sizes
4. **Professionalism**: Cohesive, polished appearance
5. **Accessibility**: Built-in contrast and readability
6. **Performance**: System fonts, optimized CSS

## Future Enhancements

- Dark mode support
- Custom theme overrides
- Animation presets
- Responsive sizing
- Print styles
