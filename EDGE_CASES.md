# Edge Case Handling Documentation

## Overview
This document outlines the edge cases handled across the codebase with lightweight guards and validation for predictable behavior and graceful failure.

## Frontend Edge Cases

### WorkflowEditor

#### 1. Empty Workflow
- **Guard**: Check for empty nodes array before analyze/submit
- **Behavior**: Show user-friendly error message
- **Location**: `handleAnalyze`, `handleSubmit`

#### 2. Network Failures
- **Guard**: Request timeout (30s) with AbortController
- **Behavior**: Specific timeout error message
- **Location**: `handleAnalyze`

#### 3. Invalid API Responses
- **Guard**: Validate response structure before processing
- **Behavior**: Handle malformed JSON gracefully
- **Location**: `handleAnalyze`

#### 4. Missing Request Bodies
- **Guard**: Check for null/undefined edges in payload building
- **Behavior**: Default to empty array
- **Location**: `handleSubmit`

### TextNode

#### 1. Empty/Null Text
- **Guard**: Default to empty string, handle null/undefined
- **Behavior**: Node renders with placeholder
- **Location**: `extractVariables`, `useState` initialization

#### 2. Very Long Text
- **Guard**: Limit text to 10,000 characters for dimension calculation
- **Behavior**: Truncate for measurement, preserve full text in state
- **Location**: `calculateDimensions`

#### 3. Invalid Variable Detection
- **Guard**: Filter out null/undefined matches from regex
- **Behavior**: Return empty array on errors
- **Location**: `extractVariables`

#### 4. Division by Zero (Variable Handles)
- **Guard**: Check for zero-length array before division
- **Behavior**: Return empty array if no variables
- **Location**: `renderVariableHandles`

#### 5. Invalid Position Values
- **Guard**: Clamp percentage between 0-100%
- **Behavior**: Ensure handles stay within bounds
- **Location**: `renderVariableHandles`

#### 6. Missing Refs
- **Guard**: Check for ref existence before DOM operations
- **Behavior**: Return default dimensions if ref missing
- **Location**: `calculateDimensions`

#### 7. Invalid Dimensions
- **Guard**: Validate width/height are finite numbers
- **Behavior**: Fall back to MIN_WIDTH/MIN_HEIGHT
- **Location**: `updateDimensions`

## Backend Edge Cases

### Graph Analyzer

#### 1. Empty Inputs
- **Guard**: Validate arrays exist and are arrays
- **Behavior**: Throw descriptive error
- **Location**: `analyzeGraph`

#### 2. Invalid Nodes
- **Guard**: Filter out nodes missing ID or type
- **Behavior**: Continue with valid nodes, warn about invalid ones
- **Location**: `analyzeGraph`

#### 3. Duplicate Node IDs
- **Guard**: Use Set to handle duplicates automatically
- **Behavior**: First occurrence wins (Set behavior)
- **Location**: `analyzeGraph`

#### 4. Self-Loops
- **Guard**: Filter edges where source === target
- **Behavior**: Exclude from analysis (treated as invalid)
- **Location**: `analyzeGraph` (validEdges filter)

#### 5. Orphaned Edges
- **Guard**: Filter edges referencing non-existent nodes
- **Behavior**: Only analyze edges between valid nodes
- **Location**: `analyzeGraph` (validEdges filter)

#### 6. Empty Graph
- **Guard**: Handle 0 nodes / 0 edges case
- **Behavior**: Return valid result with counts = 0
- **Location**: `analyzeGraph`

#### 7. Connected Components Edge Case
- **Guard**: Ensure components count is at least 1
- **Behavior**: Return max(1, calculated) to prevent 0
- **Location**: `analyzeGraph` return

### API Route (/api/workflows/analyze)

#### 1. Invalid Content-Type
- **Guard**: Check Content-Type header
- **Behavior**: Return 400 with clear error
- **Location**: `POST` handler

#### 2. Malformed JSON
- **Guard**: Try/catch around JSON.parse
- **Behavior**: Return 400 with JSON parse error
- **Location**: `POST` handler

#### 3. Missing Request Body
- **Guard**: Check body exists and is object
- **Behavior**: Return 400 with validation error
- **Location**: `POST` handler

#### 4. Payload Too Large (DoS Protection)
- **Guard**: Check nodes <= 1000, edges <= 5000
- **Behavior**: Return 413 Payload Too Large
- **Location**: `POST` handler

#### 5. Analysis Errors
- **Guard**: Try/catch around analyzeGraph call
- **Behavior**: Return 400 with analysis error details
- **Location**: `POST` handler

### Workflow API (workflowApi.ts)

#### 1. Invalid Node Structure
- **Guard**: Check for required properties (id, position)
- **Behavior**: Skip invalid nodes, log warning
- **Location**: `buildWorkflowPayload`, `transformNode`

#### 2. Invalid Edge Structure
- **Guard**: Check for required properties (id, source, target)
- **Behavior**: Skip invalid edges, log warning
- **Location**: `buildWorkflowPayload`, `transformEdge`

#### 3. Invalid Position Values
- **Guard**: Check for finite numbers, default to 0
- **Behavior**: Use safe defaults for NaN/Infinity
- **Location**: `transformNode`

#### 4. Type Coercion
- **Guard**: Ensure IDs are strings
- **Behavior**: Convert to string (handle numbers/objects)
- **Location**: `transformNode`, `transformEdge`

### Node Registry

#### 1. Invalid Node Type
- **Guard**: Check type exists in registry
- **Behavior**: Throw descriptive error
- **Location**: `createNodeFromType`

#### 2. Invalid Input Types
- **Guard**: Validate type/id are strings, position is object
- **Behavior**: Throw type-specific errors
- **Location**: `createNodeFromType`

#### 3. Invalid Position Values
- **Guard**: Check for finite numbers
- **Behavior**: Default to 0 for invalid values
- **Location**: `createNodeFromType`

## Error Handling Philosophy

### Predictable Behavior
- Always return valid data structures (no null surprises)
- Default to safe values (empty arrays, default dimensions)
- Preserve user data when possible (truncate, don't delete)

### Graceful Failure
- Log warnings for recoverable errors
- Show user-friendly messages (no technical stack traces)
- Continue processing when possible (skip invalid, process valid)

### Lightweight Guards
- Simple type checks (`typeof`, `Array.isArray`)
- Null/undefined checks (`!value`, `value || default`)
- Number validation (`Number.isFinite`, `Math.max/min`)
- Early returns for invalid inputs

## Testing Recommendations

### Frontend
- Empty workflows
- Very large workflows (1000+ nodes)
- Network failures (timeout, offline)
- Invalid API responses

### Backend
- Empty graphs
- Single node graphs
- Self-loops
- Orphaned edges
- Very large payloads
- Malformed JSON

### TextNode
- Empty text
- Very long text (>10K chars)
- Special characters in variables
- Invalid regex patterns
- Missing refs

## Performance Considerations

- Guards add minimal overhead (simple checks)
- Filtering happens once during analysis
- No defensive copying unless necessary
- Early returns prevent unnecessary computation
