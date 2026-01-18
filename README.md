# VectorShift Workflow Editor

A full-stack visual workflow editor application featuring a Next.js frontend with React Flow and a FastAPI backend for pipeline validation. The system uses a configuration-driven node abstraction that enables rapid extensibility with minimal code duplication.

**Technology Stack:** Next.js 14 + React Flow 11 (Frontend) | FastAPI + Python (Backend) | TypeScript + Pydantic (Type Safety)

## 🚀 Getting Started

> **For Reviewers:** Start here to run the project quickly

- **⚡ Quick Setup (5 min)**: [QUICKSTART.md](./QUICKSTART.md) - Fastest path to running
- **📋 Detailed Setup**: [SETUP.md](./SETUP.md) - Complete step-by-step instructions
- **📝 Submission Context**: [SUBMISSION_NOTES.md](./SUBMISSION_NOTES.md) - Project overview for reviewers

### TL;DR Setup

**Terminal 1 - Backend:**
```bash
cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm install && npm run dev
```

**Open:** http://localhost:3000

**Verify:** Both servers must be running. Backend at http://localhost:8000, Frontend at http://localhost:3000.

## Quick Start

> **📋 For detailed setup instructions, see [SETUP.md](./SETUP.md)**

### Prerequisites

- **Node.js 18+** and npm ([download](https://nodejs.org/))
- **Python 3.9+** ([download](https://www.python.org/downloads/))
- **pip3** (usually included with Python)

### Step-by-Step Setup

**1. Install Frontend Dependencies:**
```bash
npm install
```

**2. Install Backend Dependencies:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**3. Start Backend Server** (keep this terminal open):
```bash
cd backend
source venv/bin/activate  # If not already activated
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Verify backend is running: http://localhost:8000 (should show JSON response)

**4. Start Frontend Server** (open a new terminal):
```bash
# From project root
npm run dev
```

**5. Open Application:**
Open http://localhost:3000 in your browser

### Environment Variables (Optional)

Default backend URL is `http://localhost:8000` - no configuration needed. To customize, create `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Verification

After starting both servers:
- ✅ Frontend: http://localhost:3000 (should show workflow editor)
- ✅ Backend: http://localhost:8000 (should show `{"status":"healthy",...}`)
- ✅ Backend API Docs: http://localhost:8000/docs (interactive API documentation)

**Important:** Both servers must be running simultaneously. Frontend requires backend for workflow submission and analysis.

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

## Backend API

FastAPI backend for workflow pipeline validation and DAG detection. See [`backend/README.md`](./backend/README.md) for complete documentation.

### Overview

The backend exposes a single POST endpoint `/pipelines/parse` that:
- Accepts workflow pipeline definitions (nodes and edges)
- Counts valid nodes and edges
- Determines if the graph is a Directed Acyclic Graph (DAG)
- Returns statistics matching the frontend contract

### Key Features

- **DAG Detection**: DFS-based cycle detection algorithm (O(V + E) time complexity)
- **Type Safety**: Pydantic models for request/response validation
- **Secure CORS**: Minimal, production-ready CORS configuration
- **Error Handling**: Structured error responses with clear messages

### Quick Reference

**Endpoint:** `POST http://localhost:8000/pipelines/parse`

**Response Format:**
```json
{
  "success": true,
  "data": {
    "nodeCount": 3,
    "edgeCount": 2,
    "isDAG": true,
    "hasCycles": false
  }
}
```

For detailed API documentation, see [`backend/README.md`](./backend/README.md) or visit http://localhost:8000/docs when the backend is running.

## Notable Trade-offs

| Decision | Benefit | Trade-off |
|----------|---------|-----------|
| **Configuration-driven nodes** | Easy extensibility, consistency | Less flexibility for extreme customizations |
| **Inline styles (design system)** | Type-safe, no build step | No CSS optimizations (minification, etc.) |
| **Client-side only** | Simpler, faster | No SSR/SEO benefits |
| **Manual validation** | Lightweight, no deps | More verbose than schema validation |
| **Single BaseNode component** | Consistent behavior | Slight overhead for very simple nodes |
| **DFS for DAG detection** | Simple, readable, correct | Not optimized for very large graphs (>10K nodes) |
| **DFS for DAG detection** | Simple, readable, correct | Not optimized for very large graphs (>10K nodes) |

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
- DAG detection algorithm: O(V + E) time, O(V) space complexity

## Future Improvements

Potential enhancements for production deployment:

### Frontend
- **Persistent Storage**: Save/load workflows from database or local storage
- **Authentication**: User accounts and workflow ownership
- **Collaboration**: Real-time multi-user editing
- **Export/Import**: JSON/YAML workflow file formats
- **Undo/Redo**: Command pattern for workflow history
- **Node Templates**: Pre-configured node libraries

### Backend
- **Database Integration**: Store workflows, execution history
- **Workflow Execution Engine**: Run workflows with actual data processing
- **Authentication & Authorization**: JWT-based auth, role-based access
- **Rate Limiting**: Protect against abuse
- **Caching**: Cache DAG analysis results for frequently accessed workflows
- **Webhooks**: Notify external systems on workflow events

### Architecture
- **Microservices**: Split backend into separate services (validation, execution, storage)
- **Message Queue**: Async workflow execution via queue system
- **Monitoring**: Metrics, logging, error tracking (Sentry, DataDog)
- **Testing**: Comprehensive unit and integration test suite

---

**Optimized for extensibility, consistency, and maintainability.** The abstraction allows developers to add new node types rapidly while maintaining visual and behavioral consistency across the editor.
