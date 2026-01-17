# Node System Architecture

A scalable, configuration-based node system for React Flow workflows. This architecture allows you to create new node types with minimal code by passing configuration objects instead of duplicating JSX.

## Architecture Overview

### Core Components

1. **BaseNode** (`BaseNode.tsx`)
   - Handles all shared layout, rendering, and styling
   - Supports variants, sizes, custom styles, and custom content
   - Manages handle positioning and status indicators

2. **Node Types** (`nodeTypes.ts`)
   - Defines node type configurations
   - Provides helper functions to create and register node types
   - Predefined node types: `start`, `end`, `process`, `decision`, `action`

3. **Node Registry** (`nodeRegistry.tsx`)
   - Factory system that creates React Flow node types from configurations
   - Provides hooks and utilities for node creation
   - Automatically registers all node types

## Usage

### Creating Nodes from Existing Types

```typescript
import { createNodeFromType } from './nodes'

// Simple node creation
const node = createNodeFromType('process', 'node-1', { x: 100, y: 100 })

// With custom data
const customNode = createNodeFromType('start', 'node-2', { x: 200, y: 200 }, {
  label: 'Custom Start',
  description: 'My custom description',
  status: 'running',
})
```

### Adding a New Node Type

#### Option 1: Using `createNodeType` (Recommended)

```typescript
import { createNodeType, registerNodeType } from './nodes/nodeTypes'
import { Position } from 'reactflow'

const myCustomNode = createNodeType(
  'my-custom-type',
  {
    variant: 'primary',
    size: 'medium',
    handles: {
      source: [Position.Bottom],
      target: [Position.Top],
    },
    customStyles: {
      borderLeft: '4px solid #3b82f6',
    },
  },
  {
    label: 'My Custom Node',
    description: 'Default description',
  }
)

// Register it
registerNodeType(myCustomNode)

// Now use it
const node = createNodeFromType('my-custom-type', 'node-1', { x: 100, y: 100 })
```

#### Option 2: Direct Registration

```typescript
import { registerNodeType } from './nodes/nodeTypes'

registerNodeType({
  type: 'simple-node',
  config: {
    variant: 'default',
    size: 'small',
    handles: { source: true, target: true },
  },
  defaultData: {
    label: 'Simple Node',
  },
})
```

### Using Custom Content

```typescript
import { createNodeType } from './nodes/nodeTypes'
import { BaseNodeData } from './nodes/BaseNode'

const customContentNode = createNodeType(
  'custom-content',
  {
    variant: 'info',
    customContent: (data: BaseNodeData) => (
      <div>
        <h3>{data.label}</h3>
        <div>Custom rendering here</div>
        {data.metadata && <pre>{JSON.stringify(data.metadata, null, 2)}</pre>}
      </div>
    ),
  },
  {
    label: 'Custom Content Node',
  }
)
```

## Configuration Options

### BaseNodeConfig

```typescript
interface BaseNodeConfig {
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
```

### BaseNodeData

```typescript
interface BaseNodeData {
  label: string
  description?: string
  icon?: ReactNode
  status?: 'idle' | 'running' | 'success' | 'error'
  metadata?: Record<string, any>
}
```

## Variants

- **default**: White background, gray border
- **primary**: Blue theme
- **success**: Green theme
- **warning**: Orange/yellow theme
- **error**: Red theme
- **info**: Cyan theme

## Sizes

- **small**: 120px min-width, compact padding
- **medium**: 160px min-width, standard padding (default)
- **large**: 200px min-width, generous padding

## Handle Configuration

Handles can be configured in several ways:

```typescript
// Single handle (default position)
handles: {
  source: true,  // Bottom
  target: true,  // Top
}

// Multiple handles at specific positions
handles: {
  source: [Position.Bottom, Position.Right],
  target: [Position.Top, Position.Left],
}

// No handles
handles: {
  source: false,
  target: false,
}
```

## Examples

See `examples.ts` for complete examples of:
- API node with custom styling
- Database node with multiple handles
- Trigger node with custom shape
- Splitter node with multiple outputs

## Benefits

1. **No JSX Duplication**: All nodes share the same BaseNode component
2. **Configuration-Driven**: Add new types by passing config objects
3. **Type-Safe**: Full TypeScript support
4. **Consistent Styling**: Variants ensure visual consistency
5. **Extensible**: Easy to add custom content or styles
6. **Minimal Code**: New node types require only a few lines

## Best Practices

1. **Use predefined variants** when possible for consistency
2. **Register node types** at application startup
3. **Use `createNodeFromType`** for runtime node creation
4. **Leverage defaultData** for common node properties
5. **Use customContent** sparingly - prefer configuration when possible
