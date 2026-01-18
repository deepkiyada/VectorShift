# Workflow API Service

Clean, extensible API service for submitting workflow nodes and edges to a backend endpoint.

## Overview

The API service provides a structured way to submit workflow data to a backend API. It includes payload transformation, validation, and error handling.

## Features

- **Clean Payload Structure**: Normalized, extensible payload format
- **Type Safety**: Full TypeScript support with interfaces
- **Validation**: Built-in payload validation before submission
- **Error Handling**: Comprehensive error handling and reporting
- **Extensible**: Easy to extend with additional metadata or fields

## Payload Structure

### WorkflowPayload

```typescript
{
  version: "1.0.0",
  metadata?: {
    name?: string
    description?: string
    createdAt?: string
    updatedAt?: string
  },
  nodes: WorkflowNodePayload[],
  edges: WorkflowEdgePayload[]
}
```

### WorkflowNodePayload

```typescript
{
  id: string
  type: string
  position: { x: number, y: number }
  data: {
    label: string
    description?: string
    text?: string
    status?: 'idle' | 'running' | 'success' | 'error'
    config?: {
      variant?: string
      size?: string
      handles?: { ... }
    }
    metadata?: Record<string, any>
  }
  width?: number
  height?: number
}
```

### WorkflowEdgePayload

```typescript
{
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
  type?: string
  animated?: boolean
  style?: Record<string, any>
  data?: Record<string, any>
}
```

## Usage

### Basic Submission

```typescript
import { buildWorkflowPayload, submitWorkflow } from '@/lib/api'

// Build payload from nodes and edges
const payload = buildWorkflowPayload(nodes, edges, {
  name: 'My Workflow',
  description: 'A sample workflow'
})

// Submit to API
const response = await submitWorkflow(payload)

if (response.success) {
  console.log('Workflow ID:', response.data?.workflowId)
} else {
  console.error('Error:', response.error?.message)
}
```

### With Validation

```typescript
import { validateWorkflowPayload, submitWorkflow } from '@/lib/api'

const payload = buildWorkflowPayload(nodes, edges)

// Validate before submission
const validation = validateWorkflowPayload(payload)

if (!validation.valid) {
  console.error('Validation errors:', validation.errors)
  return
}

// Submit if valid
const response = await submitWorkflow(payload)
```

### Custom Endpoint

```typescript
const response = await submitWorkflow(payload, {
  endpoint: 'https://api.example.com/workflows/submit',
  headers: {
    'Authorization': 'Bearer token',
  }
})
```

## API Configuration

Set the base API URL via environment variable:

```env
NEXT_PUBLIC_API_URL=https://api.example.com/api/workflows
```

Default endpoint: `/api/workflows/submit`

## Validation

The service validates:

- Nodes have required fields (id, type, data.label)
- Edges have required fields (id, source, target)
- Edge references point to existing nodes
- Arrays are properly structured

## Error Handling

The service returns structured error responses:

```typescript
{
  success: false,
  error: {
    code: 'HTTP_400' | 'NETWORK_ERROR' | ...
    message: string
    details?: any
  }
}
```

### Error Codes

- `HTTP_<status>`: HTTP error codes (400, 401, 500, etc.)
- `NETWORK_ERROR`: Network/fetch errors
- `VALIDATION_ERROR`: Payload validation failures

## Response Structure

### Success Response

```typescript
{
  success: true,
  data: {
    workflowId?: string
    message?: string
  }
}
```

### Error Response

```typescript
{
  success: false,
  error: {
    code: string
    message: string
    details?: any
  }
}
```

## Extension Points

### Adding Custom Metadata

```typescript
const payload = buildWorkflowPayload(nodes, edges, {
  name: 'My Workflow',
  tags: ['production', 'important'],
  author: 'John Doe',
  // Add any custom fields
})
```

### Custom Node Data

Node metadata can include custom fields:

```typescript
{
  data: {
    label: 'My Node',
    metadata: {
      customField: 'value',
      settings: { ... }
    }
  }
}
```

## Best Practices

1. **Always validate** before submission
2. **Handle errors** appropriately in UI
3. **Use TypeScript** for type safety
4. **Extend metadata** for additional context
5. **Test payload structure** before production

## Example Integration

See `components/WorkflowEditor.tsx` for a complete integration example with:
- UI submission button
- Loading states
- Error/success messages
- Validation handling
