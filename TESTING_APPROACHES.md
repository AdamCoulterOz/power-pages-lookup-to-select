# Testing Approaches for Power Pages Lookup to Select v2

## 1. **Immediate Testing Options** (Ready to use now)

### A. Simple Test Runner
```bash
# Run basic structural and module tests
node tests/simple-test-runner.js
```

### B. Manual Browser Testing
```bash
# 1. Build the project
npm run build

# 2. Open the test page
open tests/browser/manual-testing.html
```

### C. TypeScript Compilation Test
```bash
# Verify all modules compile correctly
npm run build
```

## 2. **Module-by-Module Testing Strategy**

### DOM Parser Module (`src/modules/dom-parser.ts`)
**What to test:**
- `parseViewLayouts()` - Base64 decoding and JSON parsing
- `getTextFieldName()` - Column metadata extraction
- `extractEntityConfigFromDOM()` - Full DOM extraction workflow

**Test approach:**
```typescript
// Test with mock DOM structure
const mockBase64 = 'eyJ0ZXN0IjoidmFsdWUifQ=='; // {"test":"value"}
const result = parseViewLayouts(mockBase64);
// Verify result matches expected structure
```

### Data Service Module (`src/modules/data-service.ts`)
**What to test:**
- `createODataQuery()` - Query string generation
- `fetchEntityData()` - API call construction
- `createPolymorphicDataFunction()` - Multi-entity data fetching

**Test approach:**
```typescript
// Mock AJAX calls and verify query parameters
const mockEntity = {
    entitySetName: 'contacts',
    idFieldName: 'contactid',
    textFieldName: 'fullname',
    targetTableLogicalName: 'contact'
};
const query = createODataQuery(mockEntity, 'test');
// Verify: '$select=contactid,fullname&$orderby=fullname asc&$filter=startswith(fullname,'test')'
```

### Configuration Processor (`src/modules/config-processor.ts`)
**What to test:**
- `validateEntityConfig()` - Configuration validation
- `processConfiguration()` - Legacy to modern conversion

**Test approach:**
```typescript
// Test validation errors
expect(() => validateEntityConfig([])).toThrow('entities must be a non-empty array');

// Test configuration processing
const legacy = { entitySetName: 'contacts', ... };
const processed = processConfiguration(legacy, 'field_id');
// Verify conversion to entities array format
```

### Data Processor (`src/modules/data-processor.ts`)
**What to test:**
- `processGroupByField()` - Custom field grouping
- `processGroupByEntity()` - Entity-based grouping
- `processFlatList()` - Flat data formatting
- `processResults()` - Main processing pipeline

**Test approach:**
```typescript
// Test data formatting for Select2
const mockData = { value: [{ id: '1', name: 'Test' }] };
const settings = { entities: [mockEntity] };
const result = processResults(mockData, settings);
// Verify Select2-compatible format
```

## 3. **Integration Testing**

### Plugin Integration Test
```javascript
// Test complete plugin workflow
$('#test_field').lookupToSelect({
    entities: [{
        entitySetName: 'contacts',
        idFieldName: 'contactid',
        textFieldName: 'fullname',
        targetTableLogicalName: 'contact'
    }]
});

// Verify:
// 1. Select2 element created
// 2. Original field hidden
// 3. Change events work correctly
```

### Power Pages Environment Test
```html
<!-- Mock Power Pages structure -->
<div id="field_lookupmodal">
    <div class="entity-grid" data-view-layouts="[base64-config]">
    </div>
</div>
<input type="text" id="field_name">
<input type="hidden" id="field">

<script>
// Test automatic configuration extraction
$('#field').lookupToSelect(); // Should work without explicit config
</script>
```

## 4. **Error Scenario Testing**

### Configuration Errors
```javascript
// Test missing ID
expect(() => $('<input>').lookupToSelect()).toThrow('Element must have an id attribute');

// Test invalid entity config
expect(() => $('#test').lookupToSelect({
    entities: [{}]
})).toThrow('entitySetName is required');
```

### Network Errors
```javascript
// Mock AJAX failure
mockSafeAjax.mockRejectedValue(new Error('Network error'));
// Verify graceful error handling
```

### DOM Structure Errors
```javascript
// Test missing lookup modal
const result = extractEntityConfigFromDOM('nonexistent_field');
expect(result).toBeNull();
```

## 5. **Performance Testing**

### Large Dataset Testing
```javascript
// Test with 1000+ records
const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
    id: `item-${i}`,
    text: `Item ${i}`
}));

$('#field').lookupToSelect({
    data: largeDataset
});
// Measure initialization time and memory usage
```

### Multiple Instance Testing
```javascript
// Test multiple simultaneous lookups
for (let i = 0; i < 10; i++) {
    $(`#field${i}`).lookupToSelect(config);
}
// Verify no memory leaks or conflicts
```

## 6. **Browser Compatibility Testing**

### Cross-Browser Test Matrix
- **Chrome** (latest, -1, -2)
- **Firefox** (latest, -1, -2)  
- **Safari** (latest, -1)
- **Edge** (latest, -1)

### Mobile Testing
- **iOS Safari** (latest)
- **Android Chrome** (latest)

## 7. **Accessibility Testing**

### Screen Reader Testing
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS)

### Keyboard Navigation
- Tab navigation through lookups
- Enter/Space selection
- Escape dismissal

## 8. **Setting Up Full Jest Testing** (Future)

When ready for comprehensive unit testing:

```bash
# Install testing dependencies
npm install --save-dev @types/jest @types/node jest jest-environment-jsdom ts-jest

# Run Jest tests
npm test
npm run test:watch
npm run test:coverage
```

## 9. **Current Testing Workflow**

### For Development
1. **Structural validation**: `node tests/simple-test-runner.js`
2. **Compilation check**: `npm run build`
3. **Manual testing**: Open `tests/browser/manual-testing.html`
4. **Integration test**: Test in actual Power Pages environment

### For Pull Requests
1. All structural tests pass
2. Manual testing completed
3. No TypeScript compilation errors
4. Browser compatibility verified
5. Documentation updated

### For Production Release
1. Full test suite execution
2. Performance benchmarking
3. Cross-browser validation
4. Accessibility compliance
5. Real Power Pages environment testing

This multi-layered approach ensures reliability while being practical for the current development stage.
