# Variable Detection in Text Nodes

## Overview

The TextNode component now supports automatic variable detection using double curly brace syntax (`{{variableName}}`). For each detected variable, a corresponding input handle is dynamically created on the left side of the node.

## Syntax

Variables are detected using the pattern: `{{variableName}}`

### Valid Variable Names
- Must start with a letter or underscore
- Can contain letters, numbers, and underscores
- Examples:
  - `{{name}}` ✅
  - `{{user_id}}` ✅
  - `{{amount123}}` ✅
  - `{{123invalid}}` ❌ (starts with number)
  - `{{var-name}}` ❌ (contains hyphen)

### Regex Pattern
```typescript
const VARIABLE_REGEX = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g
```

## Features

### 1. Automatic Detection
- Variables are detected in real-time as the user types
- Detection happens automatically when text changes
- Unique variables are extracted (duplicates are removed)

### 2. Dynamic Handle Creation
- Each unique variable gets its own input handle (target handle)
- Handles are positioned on the left side of the node
- Handles are distributed evenly vertically
- Handles are automatically removed when variables are deleted

### 3. Handle Positioning
- Handles use percentage-based positioning for stability
- Evenly distributed across the node height
- Position updates automatically as node resizes

### 4. Handle Replacement
- When variables are detected, default target handles are replaced
- When no variables are present, default handles are restored
- Source handles (output) remain unchanged

## Usage Example

```typescript
// Text node with variables
{
  id: 'text-1',
  type: 'text',
  position: { x: 100, y: 100 },
  data: {
    text: 'Hello {{name}}, your balance is {{amount}}',
    config: {
      variant: 'info',
      size: 'medium',
    },
  },
}
```

This will create:
- 2 input handles on the left side (one for `name`, one for `amount`)
- 1 output handle on the bottom (default source handle)

## Implementation Details

### Variable Extraction
```typescript
function extractVariables(text: string): string[] {
  const matches = Array.from(text.matchAll(VARIABLE_REGEX))
  const variables = matches.map((match) => match[1])
  return Array.from(new Set(variables)) // Unique, preserving order
}
```

### Handle Rendering
- Each variable gets a handle with ID: `variable-${variableName}`
- Handles are positioned using percentage: `top: ${topPercent}%`
- Handles include `data-variable` attribute for identification

### State Management
- Variables are stored in component state: `detectedVariables`
- Updated automatically via `useEffect` when text changes
- Handles re-render when variables change

## Benefits

1. **Dynamic Workflow Building**: Create data flows based on text content
2. **Visual Clarity**: See all required inputs at a glance
3. **Automatic Updates**: Handles update as you type
4. **Type Safety**: Valid variable names only
5. **Clean Interface**: No manual handle configuration needed

## Edge Cases Handled

- **Empty text**: No handles created
- **Invalid syntax**: Ignored (e.g., `{{123}}`, `{{var-name}}`)
- **Duplicate variables**: Only one handle per unique variable
- **Nested braces**: Not supported (e.g., `{{{{var}}}}`)
- **Node resizing**: Handles maintain correct positions

## Future Enhancements

Potential improvements:
- Variable validation/autocomplete
- Handle labels showing variable names
- Variable type hints
- Connection validation based on variable types
- Variable renaming across all occurrences
