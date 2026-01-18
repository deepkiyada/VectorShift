# VectorShift Workflow Editor

A Next.js-based visual workflow editor built on React Flow, featuring a configuration-driven node system that enables rapid extensibility with minimal code duplication.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production build: `npm run build && npm start`

## Architecture Overview

The application follows a three-tier architecture:

```
┌─────────────────────────────────────────────────┐
│  UI Layer (WorkflowEditor, Panels, Alerts)     │
├─────────────────────────────────────────────────┤
│  Node System (BaseNode, Registry, Types)       │
├─────────────────────────────────────────────────┤
│  Data Layer (API Service, Graph Analyzer)      │
└─────────────────────────────────────────────────┘
```

### Core Components

- **`WorkflowEditor`**: Main React Flow canvas, manages node/edge state, handles workflow submission/analysis
- **`BaseNode`**: Shared node component handling layout, styling, handles, and status indicators
- **`nodeRegistry`**: Factory system that converts node configurations into React Flow node types
- **`designSystem`**: Centralized design tokens (colors, spacing, typography, shadows)
- **`workflowApi`**: Payload transformation, validation, and API communication
- **`graph/analyzer`**: Graph algorithms (DAG detection, cycle detection, topological sort)

## Node Abstraction Strategy

### Problem

Traditional React Flow implementations require creating a new component for each node type, leading to:
- JSX duplication across node types
- Inconsistent styling and behavior
- High maintenance overhead when adding new types

### Solution

A **configuration-driven abstraction** where node types are defined declaratively:

```typescript
// Define a node type with configuration
const dataSourceNode = createNodeType('dataSource', {
  variant: 'primary',
  size: 'medium',
  handles: { source: [Position.Bottom], target: [Position.Top] }
}, {
  label: 'Data Source',
  description: 'Default description'
})

// Use it to create instances
const node = createNodeFromType('dataSource', 'node-1', { x: 100, y: 100 })
```

### How It Works

1. **Configuration Definition** (`nodeTypes.ts`)
   - Node types defined as configuration objects
   - Specifies variant, size, handle positions, default data

2. **Factory Registration** (`nodeRegistry.tsx`)
   - Registry maps type names to React Flow components
   - `BaseNode` wraps all configurations, handles shared logic

3. **Runtime Rendering** (`BaseNode.tsx`)
   - Single component renders all node types
   - Dynamically applies styles, handles, and content based on config
   - Supports custom content renderers for special cases

### Special Cases

**TextNode** (`TextNode.tsx`): Auto-resizing text input with variable detection (`{{variable}}` syntax). Requires custom logic, so implemented as a separate component that extends `BaseNode` patterns.

## Key Design Decisions

### 1. Client-Side Only Rendering

**Decision**: All React Flow components use `'use client'` with dynamic imports (`ssr: false`)

**Rationale**: React Flow requires browser APIs (DOM, canvas). SSR would require complex hydration logic with minimal benefit for an interactive editor.

**Trade-off**: No SEO benefits, but simpler architecture and better performance.

### 2. Configuration-Driven Nodes

**Decision**: Use configuration objects instead of component-per-type pattern

**Rationale**: 
- **Extensibility**: Adding new node types requires ~10 lines of config vs. 50+ lines of JSX
- **Consistency**: All nodes share same layout/styling logic
- **Maintainability**: Design system changes propagate automatically

**Trade-off**: Less flexibility for highly custom node types (but custom renderers supported)

### 3. Centralized Design System

**Decision**: Token-based design system in `designSystem.ts` (not CSS-in-JS or Tailwind)

**Rationale**: 
- Type-safe design tokens
- Easy to theme/modify
- Inline styles keep dependencies minimal

**Trade-off**: No dynamic theming, but simpler bundle size

### 4. Payload Transformation Layer

**Decision**: Separate transformation logic between React Flow data and API payloads

**Rationale**:
- API format can evolve independently
- Validation happens before network calls
- Clean separation of concerns

**Trade-off**: Slight overhead, but improves maintainability

### 5. Edge Case Handling

**Decision**: Lightweight guards throughout (null checks, array validation, type coercion)

**Rationale**: Prevent common runtime errors without heavy validation libraries

**Trade-off**: Manual guards vs. schema validation (Zod/Yup), but lower dependency footprint

## Project Structure

```
.
├── app/
│   ├── api/workflows/analyze/  # Graph analysis endpoint
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Entry point (dynamic import)
│   └── globals.css              # Global styles + React Flow overrides
│
├── components/
│   ├── WorkflowEditor.tsx       # Main editor component
│   ├── WorkflowStatisticsAlert.tsx  # Analysis results UI
│   └── nodes/
│       ├── BaseNode.tsx         # Shared node component
│       ├── TextNode.tsx         # Specialized text node
│       ├── nodeRegistry.tsx     # Factory & hooks
│       ├── nodeTypes.ts         # Node type definitions
│       └── designSystem.ts      # Design tokens
│
└── lib/
    ├── api/
    │   └── workflowApi.ts       # Payload transformation & API calls
    └── graph/
        └── analyzer.ts          # Graph algorithms (DAG, cycles, etc.)
```

## Notable Trade-offs

| Decision | Benefit | Trade-off |
|----------|---------|-----------|
| **Configuration-driven nodes** | Easy extensibility, consistency | Less flexibility for extreme customizations |
| **Inline styles (design system)** | Type-safe, no build step | No CSS optimizations (minification, etc.) |
| **Client-side only** | Simpler, faster | No SSR/SEO benefits |
| **Manual validation** | Lightweight, no deps | More verbose than schema validation |
| **Single BaseNode component** | Consistent behavior | Slight overhead for very simple nodes |

## Extending the System

### Adding a New Node Type

1. Define configuration in `nodeTypes.ts`:
```typescript
registerNodeType(createNodeType('myType', {
  variant: 'info',
  handles: { source: true, target: true }
}, { label: 'My Node' }))
```

2. Use it:
```typescript
const node = createNodeFromType('myType', 'id', { x: 0, y: 0 })
```

### Adding Custom Logic

For nodes requiring custom behavior (like `TextNode`), create a separate component that:
- Follows `BaseNode` patterns
- Registers in `nodeRegistry` manually
- Extends configuration as needed

## Technology Stack

- **Next.js 14** (App Router) - React framework
- **React Flow 11** - Node/edge editor
- **TypeScript** - Type safety
- **No CSS framework** - Design system via inline styles

## Key Features

- ✅ Configuration-driven node system (add types with ~10 lines)
- ✅ Auto-resizing text nodes with variable detection
- ✅ Workflow submission with payload validation
- ✅ Graph analysis (DAG detection, cycle detection, topological sort)
- ✅ Consistent design system with hover/focus states
- ✅ Edge case handling (null guards, validation, error recovery)

## Documentation

- `components/nodes/README.md` - Detailed node system architecture
- `components/nodes/DESIGN_SYSTEM.md` - Design token documentation
- `lib/api/README.md` - API service documentation
- `EDGE_CASES.md` - Edge case handling guide

## Performance Considerations

- React Flow nodes are memoized via `nodeRegistry`
- Dimension calculations use `requestAnimationFrame` for smooth updates
- Payload size limited to 1000 nodes / 5000 edges (DoS protection)
- CSS animations use GPU-friendly transforms

---

**Optimized for extensibility, consistency, and maintainability.** The abstraction allows developers to add new node types rapidly while maintaining visual and behavioral consistency across the editor.
