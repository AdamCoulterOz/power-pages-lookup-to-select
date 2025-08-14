# AttributeTypeMapping System

This system provides **sound** compile-time and runtime type safety for discriminated unions using both `AttributeType` and `AttributeTypeName` discriminators.

## Overview

The system maps Power Pages attribute metadata types to their specific TypeScript interfaces using two discriminator fields:
- `AttributeType`: Enum value (e.g., `AttributeType.String`)
- `AttributeTypeName`: String literal type (e.g., `'StringType'`)

**Key Feature**: The system only narrows types when they are actually mapped, ensuring type safety.

## Key Components

### 1. Type Mappings

```typescript
// Maps AttributeType enum to specific interfaces
type AttributeMetaByType = {
    [AttributeType.Boolean]: BooleanMeta;
    [AttributeType.String]: StringMeta;
    [AttributeType.Integer]: IntegerMeta;
    // Only types with specific implementations
};

// Runtime set of mapped types for safe narrowing
const MappedAttributeTypes = new Set<AttributeType>([
    AttributeType.Boolean,
    AttributeType.String, 
    AttributeType.Integer,
    AttributeType.Lookup
]);
```

### 2. Sound Runtime Validation

```typescript
// Type guard to check if a type has a specific mapping
if (isAttributeTypeMapped(meta.AttributeType)) {
    // Safe to narrow to specific type
    const resolved = resolveAttributeMeta(meta); // Returns specific type
} else {
    // Returns generic AttributeMeta for unmapped types
    const resolved = resolveAttributeMeta(meta); // Returns AttributeMeta
}
```

### 3. Overloaded Resolution Function

```typescript
// Overloaded to only narrow when type is actually mapped
function resolveAttributeMeta<T extends AttributeMeta>(
    meta: T
): T extends { AttributeType: keyof AttributeMetaByType } 
    ? AttributeMetaByType[T['AttributeType']] 
    : T;

// Safe for both mapped and unmapped types
const stringMeta = resolveAttributeMeta(mappedStringAttribute);    // Returns StringMeta
const customMeta = resolveAttributeMeta(unmappedCustomAttribute);  // Returns AttributeMeta
```

### 4. Safe Pattern Matching

```typescript
const result = matchAttributeMeta(meta, {
    [AttributeType.String]: (stringMeta) => {
        // stringMeta is the resolved StringMeta with validated discriminators
        // Not the original meta - fully type-safe access
        return stringMeta.DatabaseLength;
    },
    [AttributeType.Integer]: (integerMeta) => {
        // integerMeta is the resolved IntegerMeta with validated discriminators
        return integerMeta.MaxValue;
    },
    default: (genericMeta) => {
        // Handles unmapped types safely as original AttributeMeta
        return `unmapped: ${genericMeta.LogicalName}`;
    }
});

// Key improvements:
// ✅ Handlers receive resolved meta (validated discriminators)
// ✅ Uses narrowed key for handler lookup
// ✅ No 'as any' casts needed
// ✅ Extensible without explicit switch cases
```

### 5. Sound Type Narrowing

```typescript
// Now properly constrained to only mapped types
export function narrowAttributeMetaByType<T extends keyof AttributeMetaByType>(
    meta: AttributeMeta,
    expectedType: T
): AttributeMetaByType[T]

// Usage - compile-time safe, no 'as any' needed
try {
    const integerMeta = narrowAttributeMetaByType(meta, AttributeType.Integer); // ✅ Works
    console.log(integerMeta.MinValue); // Fully typed
    
    // This is now a compile error - prevents runtime issues:
    // const dateTimeMeta = narrowAttributeMetaByType(meta, AttributeType.DateTime); // ❌ Compile error
} catch (error) {
    // Handle validation errors
}
```

## Benefits

1. **Sound Type Safety**: No unsafe casts - only narrows when types are actually mapped
2. **Graceful Degradation**: Unmapped types fall back to generic `AttributeMeta`
3. **Runtime Validation**: Ensures discriminators are consistent
4. **Extensible**: Easy to add new mapped types to `MappedAttributeTypes` set
5. **Clear Error Handling**: Distinguishes between type mismatches and unmapped types

## Usage Examples

## Strong Typing with AttributeType Enum

The system uses `AttributeType` enum instead of strings for maximum type safety in downstream processing:

```typescript
export interface ProcessedAttribute {
    name: string;
    type: AttributeType; // Enum instead of string for stronger typing
    value: any;
    formattedValue?: string;
    displayValue?: string;
    metadata?: any;
}

// Maps LookupData.Type to AttributeType for consistency
function mapTypeToAttributeType(type: Type): AttributeType {
    switch (type) {
        case Type.String: return AttributeType.String;
        case Type.Integer: return AttributeType.Integer;
        case Type.Boolean: return AttributeType.Boolean;
        // ... complete mapping
    }
}
```

### Benefits of Enum-Based Typing

```typescript
// ✅ Strong typing enables exhaustive switches
function processAttribute(attr: ProcessedAttribute) {
    switch (attr.type) {
        case AttributeType.String:
            return handleStringAttribute(attr);
        case AttributeType.Integer:
            return handleIntegerAttribute(attr);
        case AttributeType.Boolean:
            return handleBooleanAttribute(attr);
        case AttributeType.DateTime:
            return handleDateAttribute(attr);
        // TypeScript ensures all cases are handled
    }
}

// ✅ Type-safe filtering
const stringAttrs = attributes.filter(a => a.type === AttributeType.String);
const numericAttrs = attributes.filter(a => 
    a.type === AttributeType.Integer || 
    a.type === AttributeType.Decimal ||
    a.type === AttributeType.Double
);

// ✅ Type-safe grouping
const grouped = groupAttributesByType(attributes);
const stringGroup = grouped.get(AttributeType.String); // ProcessedAttribute[]
```

## Safe Value Extraction

The system includes safe value extraction utilities to handle both theoretical type definitions and actual Power Pages runtime data:

```typescript
// Problem: TypeScript types suggest nested .Value.Value but runtime may be different
const value = attribute.Value.Value; // ❌ May be undefined for primitives

// Solution: Safe extraction that handles both patterns
const value = extractAttributeValue(attribute); // ✅ Works for both nested and direct values

// Type-specific extractors with validation
const stringValue = extractStringValue(attribute);     // Returns string | null
const numberValue = extractNumberValue(attribute);     // Returns number | null  
const booleanValue = extractBooleanValue(attribute);   // Returns boolean | null
const dateValue = extractDateValue(attribute);         // Returns Date | null (handles ISO strings)
const entityRefValue = extractEntityReferenceValue(attribute); // Returns EntityReference | null
```

## Common Value Shape Helpers

Helper functions for common Power Pages value structures avoid re-inferring types in specific processors:

```typescript
// OptionSet values (for PickList, State, Status fields)
const optionSet = asOptionSet(attribute.Value);
if (optionSet) {
    console.log(`Value: ${optionSet.Value}, Label: ${optionSet.Label}`);
}

// Money values (for Money fields) - models Dataverse EntityReference currency
const money = asMoney(attribute.Value);
if (money) {
    console.log(`Amount: ${money.Value}`);
    if (money.Currency) {
        console.log(`Currency ID: ${money.Currency.Id}, Name: ${money.Currency.Name}`);
    }
}

// Alternative Money helper for simple currency codes
const moneyWithCode = asMoneyWithCurrencyCode(attribute.Value);
if (moneyWithCode) {
    console.log(`Amount: ${moneyWithCode.Value}, Currency: ${moneyWithCode.CurrencyCode}`);
}

// EntityReference values (for Lookup, Customer, Owner fields)
const entityRef = asEntityReference(attribute.Value);
if (entityRef) {
    console.log(`ID: ${entityRef.Id}, Name: ${entityRef.Name}, Type: ${entityRef.LogicalName}`);
}
```

## Label Preservation

The system automatically preserves labels and structured data for complex types while unwrapping simple values:

```typescript
// OptionSet attributes keep their labels
const pickListAttr = processAttribute(attribute); // type: PickList
// pickListAttr.value = { Value: 1, Label: "Active" } instead of just 1

// Money attributes keep their currency information  
const moneyAttr = processAttribute(attribute); // type: Money
// moneyAttr.value = { Value: 100.50, Currency: { Id: "...", Name: "USD" } }

// Simple types are unwrapped to primitives
const stringAttr = processAttribute(attribute); // type: String
// stringAttr.value = "Hello World" (unwrapped string)
```

## Example Usage with Helper Functions

```typescript
// Process different attribute types using helper functions
export function processPickListAttribute(attribute: Attribute): { value: number; label?: string } | null {
    const optionSetValue = asOptionSet(attribute.Value);
    if (optionSetValue) {
        return {
            value: optionSetValue.Value,
            label: optionSetValue.Label
        };
    }
    return null;
}

export function processMoneyAttribute(attribute: Attribute): { amount: number; currency?: { id: string; name?: string } } | null {
    const moneyValue = asMoney(attribute.Value);
    if (moneyValue) {
        return {
            amount: moneyValue.Value,
            currency: moneyValue.Currency ? { id: moneyValue.Currency.Id, name: moneyValue.Currency.Name } : undefined
        };
    }
    return null;
}

export function processLookupAttribute(attribute: Attribute): { id: string; name?: string; entityType?: string } | null {
    const entityRef = asEntityReference(attribute.Value);
    if (entityRef) {
        return {
            id: entityRef.Id,
            name: entityRef.Name,
            entityType: entityRef.LogicalName
        };
    }
    return null;
}
```

### Handling New/Unmapped Types

```typescript
// DateTime not yet mapped - gracefully handled
const dateTimeMeta = createAttributeMeta(AttributeType.DateTime, 'DateTimeType');

console.log(isAttributeTypeMapped(AttributeType.DateTime)); // false

const resolved = resolveAttributeMeta(dateTimeMeta); // Returns AttributeMeta
// No unsafe cast to non-existent DateTimeMeta interface
```

## Adding New Attribute Types

1. Create the specific interface (e.g., `DateTimeMeta extends AttributeMeta`)
2. Add to `AttributeMetaByType` mapping: `[AttributeType.DateTime]: DateTimeMeta`
3. Add to `AttributeMetaByTypeName` mapping: `'DateTimeType': DateTimeMeta`
4. Add to `MappedAttributeTypes` set: `AttributeType.DateTime`
5. Import in `AttributeTypeMapping.ts`

The system will automatically provide **sound** type safety for the new attribute type.

## Type Safety Guarantees

✅ **No unsafe casts**: Removed `as any` - all type narrowing is sound  
✅ **Compile-time constraints**: `narrowAttributeMetaByType` only accepts mapped types  
✅ **Graceful fallback**: Unmapped types use generic `AttributeMeta` via `resolveAttributeMeta`  
✅ **Runtime validation**: Discriminator consistency enforced  
✅ **Full TypeScript safety**: Complete type checking and IntelliSense  
✅ **Prevents runtime errors**: Unmapped types caught at compile-time  
✅ **Future-proof**: New CRM attribute types won't break existing code
