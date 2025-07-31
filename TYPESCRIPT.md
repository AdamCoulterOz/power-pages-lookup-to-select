# TypeScript Usage Guide

This guide shows how to use the power-pages-lookup-to-select plugin with TypeScript.

## Installation

```bash
npm install power-pages-lookup-to-select
```

## TypeScript Support

The package includes full TypeScript definitions with proper types for all options and callbacks.

### Dependencies

The package includes these dependencies:
- `pluralize` - For safe entity name pluralization
- `select2` - The underlying Select2 library

### Type Definitions

All interfaces are properly typed:

```typescript
interface LookupToSelectOptions {
    // Single entity configuration (legacy)
    entitySetName?: string;
    idFieldName?: string;
    textFieldName?: string;
    targetTableLogicalName?: string;
    displayName?: string;

    // Polymorphic entity configuration
    entities?: EntityConfig[];

    // Data source options
    data?: Select2Option[];
    getData?: GetDataFunction;

    // Grouping options
    groupByFieldName?: string;
    groupByTextFieldName?: string;
    groupByEntity?: boolean;

    // Select2 configuration
    placeholder?: string;
    minimumInputLength?: number;
    delay?: number;

    // Custom rendering
    optionRenderer?: OptionRenderer;
    resultRenderer?: ResultRenderer;
}
```

### GetData Function Signature

The `getData` function has a well-defined signature:

```typescript
type GetDataFunction = (
    searchTerm: string,
    successHandler: (data: ODataResponse) => void,
    errorHandler: (error: any) => void
) => void;
```

Where `ODataResponse` has this structure:

```typescript
interface ODataResponse {
    value: DataItemWithMetadata[];
    [key: string]: any;
}

interface DataItemWithMetadata {
    [key: string]: any; // Original entity fields
    _entitySetName: string;
    _targetTableLogicalName: string;
    _idFieldName: string;
    _textFieldName: string;
    _entityDisplayName: string;
}
```

## Key Improvements in TypeScript Version

### 1. Safe Pluralization

Uses the `pluralize` package instead of naive string concatenation:

```typescript
// Before: Manual pluralization
let entitySetName = entityName;
if (!entitySetName.endsWith('s')) {
    entitySetName += 's';
}

// After: Using pluralize package
const entitySetName = pluralize(entityName);
```

This handles edge cases like:
- `person` → `people` (not `persons`)
- `child` → `children` (not `childs`)
- `mouse` → `mice` (not `mouses`)

### 2. Proper Type Safety

- Full IntelliSense support
- Compile-time error checking
- Proper Select2 option types
- Type-safe renderer functions

### 3. Module Support

The plugin can be used both as a UMD module and as an ES6 module:

```typescript
// As jQuery plugin (auto-registers)
import 'power-pages-lookup-to-select';
$('#lookup').lookupToSelect(options);

// As explicit import
import lookupToSelect, { LookupToSelectOptions } from 'power-pages-lookup-to-select';
```

## Build Process

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Watch mode for development
npm run dev

# Clean and rebuild
npm run rebuild
```

This generates:
- `dist/index.js` - Compiled JavaScript (UMD format)
- `dist/index.d.ts` - TypeScript declarations
- `dist/index.js.map` - Source maps
- `dist/index.d.ts.map` - Declaration maps

## Browser Usage

For browser usage, the compiled JavaScript includes all dependencies and can be used directly:

```html
<script src="node_modules/power-pages-lookup-to-select/dist/index.js"></script>
<script>
    $('#lookup').lookupToSelect(options);
</script>
```
