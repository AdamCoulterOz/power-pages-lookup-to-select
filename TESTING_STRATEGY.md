# Testing Strategy for Power Pages Lookup to Select v2

## Overview

This document outlines a comprehensive testing approach for the modular TypeScript implementation of the Power Pages Lookup to Select library.

## 1. Unit Testing Strategy

### Test Structure
```
tests/
├── setup.ts                    # Global test setup and mocks
├── unit/
│   ├── dom-parser.test.ts      # DOM parsing utilities
│   ├── data-service.test.ts    # API calls and data retrieval
│   ├── data-processor.test.ts  # Data formatting and grouping
│   ├── config-processor.test.ts # Configuration validation
│   ├── utils.test.ts           # Utility functions
│   └── plugin.test.ts          # Main plugin implementation
├── integration/
│   ├── plugin-integration.test.ts
│   └── end-to-end.test.ts
└── browser/
    ├── power-pages-integration.html
    └── manual-test-cases.md
```

### Key Testing Areas

#### A. DOM Parser Tests (`dom-parser.test.ts`)
- ✅ Base64 decoding and JSON parsing
- ✅ Column metadata extraction
- ✅ Entity configuration extraction from DOM
- ✅ Error handling for malformed data
- ✅ Edge cases (missing elements, invalid structure)

#### B. Data Service Tests (`data-service.test.ts`)
- OData query construction
- API call mocking and verification
- Error handling for network failures
- Authentication token handling
- Polymorphic data function creation

#### C. Data Processor Tests (`data-processor.test.ts`)
- Select2 data formatting
- Grouping logic (by field, by entity, flat)
- Metadata normalization
- Edge cases (empty data, malformed responses)

#### D. Configuration Processor Tests (`config-processor.test.ts`)
- Entity configuration validation
- Legacy to modern config conversion
- DOM extraction integration
- Error scenarios and validation

#### E. Utils Tests (`utils.test.ts`)
- AJAX wrapper functionality
- Lookup value setting
- Power Pages integration points

#### F. Plugin Tests (`plugin.test.ts`)
- End-to-end plugin initialization
- Select2 integration
- Event handling
- Configuration processing flow

## 2. Integration Testing

### Plugin Integration Tests
- Complete workflow from initialization to selection
- Multiple entity configurations
- Custom renderers and data sources
- Error scenarios and recovery

### Power Pages Integration
- DOM structure compatibility
- Authentication flow
- Real lookup modal integration

## 3. Browser Testing

### Manual Test Cases
- Real Power Pages environment testing
- Cross-browser compatibility
- Performance under load
- Accessibility compliance

### Automated Browser Tests (Future)
- Selenium/Playwright integration
- Real DOM manipulation
- User interaction simulation

## 4. Testing Tools

### Core Framework
- **Jest**: Primary testing framework
- **ts-jest**: TypeScript support
- **jsdom**: DOM environment simulation
- **@types/jest**: TypeScript definitions

### Mocking Strategy
- jQuery mocking for unit tests
- Power Pages globals (shell, validateLoginSession)
- AJAX request mocking
- DOM element mocking

### Coverage Goals
- Unit test coverage: >90%
- Integration test coverage: >80%
- Critical path coverage: 100%

## 5. Test Execution

### Local Development
```bash
npm test                # Run all tests
npm run test:watch     # Watch mode for development
npm run test:coverage  # Generate coverage report
```

### CI/CD Integration
- Automated test execution on PR
- Coverage reporting
- Performance regression detection

## 6. Mock Data Structures

### Sample Entity Configuration
```typescript
const mockEntityConfig = {
    entitySetName: 'sch_addresses',
    idFieldName: 'sch_addressid',
    textFieldName: 'sch_name',
    targetTableLogicalName: 'sch_address',
    displayName: 'Address Lookup View',
    viewId: 'test-view-id'
};
```

### Sample Power Pages DOM Structure
```html
<div id="test_field_lookupmodal">
    <div class="entity-grid" data-view-layouts="[base64-encoded-config]">
        <!-- Lookup modal content -->
    </div>
</div>
```

### Sample OData Response
```typescript
const mockODataResponse = {
    value: [
        {
            sch_addressid: 'guid-1',
            sch_name: 'Test Address 1',
            _entitySetName: 'sch_addresses',
            _targetTableLogicalName: 'sch_address',
            _idFieldName: 'sch_addressid',
            _textFieldName: 'sch_name',
            _entityDisplayName: 'Address'
        }
    ]
};
```

## 7. Performance Testing

### Load Testing
- Large dataset handling (1000+ records)
- Multiple simultaneous lookups
- Memory usage optimization

### Response Time Testing
- API call performance
- DOM manipulation speed
- Select2 initialization time

## 8. Accessibility Testing

### Screen Reader Compatibility
- ARIA labels and descriptions
- Keyboard navigation
- Focus management

### WCAG Compliance
- Color contrast requirements
- Alternative text for visual elements
- Semantic HTML structure

## 9. Backward Compatibility Testing

### Legacy API Support
- Single entity configuration format
- Existing implementation compatibility
- Migration path validation

### Version Compatibility
- jQuery version compatibility
- Select2 version compatibility
- Power Pages platform versions

## 10. Error Scenario Testing

### Network Failures
- API timeout handling
- Connection error recovery
- Graceful degradation

### Configuration Errors
- Invalid entity configurations
- Missing DOM elements
- Malformed data responses

### User Input Edge Cases
- Special characters in search
- Empty search results
- Rapid input changes

This comprehensive testing strategy ensures the reliability, performance, and maintainability of the v2 modular architecture while providing confidence for production deployment.
