# Modular Architecture

This document describes the new modular architecture for the Power Pages Lookup to Select plugin.

## Overview

The plugin has been refactored into a modular structure that improves:
- **Code organization** - Logical separation of concerns
- **Maintainability** - Easier to modify and extend individual components
- **Testability** - Individual modules can be unit tested
- **Reusability** - Modules can be used independently in other projects

## Module Structure

### `/src/modules/types.ts`
- **Purpose**: All TypeScript type definitions and interfaces
- **Exports**: 
  - `EntityConfig` - Single entity configuration
  - `LookupToSelectOptions` - Main plugin options
  - `DataItemWithMetadata` - Enhanced data items with metadata
  - `ODataResponse` - API response structure
  - Custom renderer function types

### `/src/modules/utils.ts`
- **Purpose**: General utility functions
- **Exports**:
  - `safeAjax()` - Power Pages authentication wrapper
  - `setLookupValues()` - Helper to set lookup field values

### `/src/modules/dom-parser.ts`
- **Purpose**: DOM parsing and Power Pages configuration extraction
- **Exports**:
  - `parseViewLayouts()` - Parses base64 view layout data
  - `getTextFieldName()` - Extracts text field from column metadata
  - `extractEntityConfigFromDOM()` - Main DOM extraction function

### `/src/modules/data-service.ts`
- **Purpose**: API calls and data retrieval
- **Exports**:
  - `createODataQuery()` - Builds OData query strings
  - `fetchEntityData()` - Makes API calls for single entities
  - `createPolymorphicDataFunction()` - Creates getData function for multiple entities

### `/src/modules/data-processor.ts`
- **Purpose**: Data formatting and processing for Select2
- **Exports**:
  - `normalizeDataWithMetadata()` - Adds metadata to external data
  - `processGroupByField()` - Groups data by custom field
  - `processGroupByEntity()` - Groups data by entity type
  - `processFlatList()` - Formats data as flat list
  - `processResults()` - Main data processing function

### `/src/modules/config-processor.ts`
- **Purpose**: Configuration validation and setup
- **Exports**:
  - `validateEntityConfig()` - Validates entity configurations
  - `processConfiguration()` - Main configuration processing

### `/src/modules/plugin.ts`
- **Purpose**: Main plugin implementation and Select2 setup
- **Exports**:
  - `createSelect2Instance()` - Creates Select2 element
  - `setupInitialValue()` - Handles initial value setup
  - `createSelect2Config()` - Creates Select2 configuration
  - `setupChangeHandler()` - Sets up change event handling
  - `lookupToSelect()` - Main plugin function

### `/src/index-modular.ts`
- **Purpose**: Main entry point that combines all modules
- **Usage**: Drop-in replacement for the current `index.ts`

## Building the Modular Version

```bash
# Build modular version
npm run build:modular

# Clean and rebuild modular version
npm run rebuild:modular
```

## Usage Examples

### Basic Usage (Same as before)
```typescript
$("#my_lookup").lookupToSelect({
    placeholder: "Search..."
});
```

### Advanced Usage - Using Individual Modules
```typescript
import { 
    extractEntityConfigFromDOM, 
    createPolymorphicDataFunction,
    processResults 
} from './modules';

// Extract configuration manually
const entities = extractEntityConfigFromDOM('my_lookup');

// Create custom data function
const customGetData = createPolymorphicDataFunction(entities);

// Process results manually
const processedData = processResults(rawData, settings);
```

### Custom Implementation
```typescript
import { 
    EntityConfig, 
    createODataQuery, 
    fetchEntityData 
} from './modules';

// Create custom entity configuration
const myEntity: EntityConfig = {
    entitySetName: "custom_entities",
    idFieldName: "id",
    textFieldName: "name",
    targetTableLogicalName: "custom_entity"
};

// Use individual functions
const query = createODataQuery(myEntity, "search term");
const data = await fetchEntityData(myEntity, "search term");
```

## Migration Guide

### From Monolithic to Modular

**Current (Monolithic)**:
```typescript
import lookupToSelect from './dist/index.js';
```

**New (Modular)**:
```typescript
import lookupToSelect from './dist-modular/index-modular.js';
// OR for individual modules
import { lookupToSelect } from './dist-modular/modules/plugin.js';
import { EntityConfig } from './dist-modular/modules/types.js';
```

### Backward Compatibility

The modular version is **100% backward compatible**. All existing code will work without changes:

```typescript
// This still works exactly the same
$("#my_lookup").lookupToSelect({
    entities: [...],
    placeholder: "Search..."
});
```

## Benefits

### For Developers
1. **Easier Testing**: Each module can be unit tested independently
2. **Better IDE Support**: Smaller files with focused functionality
3. **Easier Debugging**: Clear separation makes issues easier to locate
4. **Extensibility**: New features can be added as separate modules

### For Users
1. **Tree Shaking**: Bundle only the modules you need
2. **Better Performance**: Smaller bundles when using selective imports
3. **Advanced Customization**: Access to internal functions for custom implementations

### For Maintainers
1. **Cleaner Code**: Each file has a single responsibility
2. **Easier Reviews**: Smaller, focused pull requests
3. **Reduced Complexity**: Changes affect smaller, isolated areas
4. **Better Documentation**: Each module can be documented independently

## Future Enhancements

With the modular structure, future enhancements can be added as new modules:

- **Caching Module**: Add intelligent caching for API responses
- **Validation Module**: Enhanced input validation and sanitization
- **Theming Module**: Advanced UI customization options
- **Analytics Module**: Usage tracking and performance monitoring
- **Offline Module**: Offline support and data synchronization

## Comparison: Monolithic vs Modular

| Aspect | Monolithic (`index.ts`) | Modular (`modules/`) |
|--------|------------------------|---------------------|
| **File Size** | 1 file, ~570 lines | 7 files, ~80-150 lines each |
| **Maintainability** | Harder to navigate | Easy to find specific functionality |
| **Testing** | Must test entire plugin | Can test individual functions |
| **Bundle Size** | Always full plugin | Tree-shakeable |
| **Extensibility** | Modify single large file | Add new modules |
| **Code Reuse** | Limited | High - modules can be reused |
| **Learning Curve** | Single file to understand | Clear module boundaries |

The modular architecture provides a foundation for long-term maintainability while preserving all existing functionality and maintaining 100% backward compatibility.
