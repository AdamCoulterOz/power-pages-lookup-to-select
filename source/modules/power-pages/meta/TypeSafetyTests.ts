import { AttributeType, AttributeTypeNameValue, AttributeMeta } from "./Attribute";
import { 
    resolveAttributeMeta, 
    isAttributeTypeMapped, 
    matchAttributeMeta,
    narrowAttributeMetaByType 
} from "./AttributeTypeMapping";
import { Value } from "../Value";

/**
 * Test cases demonstrating the sound type narrowing behavior
 */

// Mock attribute metadata for testing
function createMockAttributeMeta(
    attributeType: AttributeType, 
    typeName: AttributeTypeNameValue
): AttributeMeta {
    return {
        AttributeType: attributeType,
        AttributeTypeName: { Value: typeName } as Value<AttributeTypeNameValue>,
        LogicalName: 'test',
        SchemaName: 'test',
        EntityLogicalName: 'test',
        // ... other required properties with mock values
    } as AttributeMeta;
}

/**
 * Test 1: Sound behavior for mapped types
 */
export function testMappedTypeResolution() {
    const stringMeta = createMockAttributeMeta(AttributeType.String, 'StringType');
    
    // This is safe because String is in our mapped types
    const resolved = resolveAttributeMeta(stringMeta);
    console.log('Mapped type resolved:', typeof resolved);
    
    // Type narrowing works safely
    const narrowed = narrowAttributeMetaByType(stringMeta, AttributeType.String);
    console.log('Narrowed type:', narrowed);
}

/**
 * Test 2: Sound behavior for unmapped types
 */
export function testUnmappedTypeResolution() {
    const dateTimeMeta = createMockAttributeMeta(AttributeType.DateTime, 'DateTimeType');
    
    // Check if type is mapped
    console.log('Is DateTime mapped?', isAttributeTypeMapped(AttributeType.DateTime));
    
    // This is safe - resolveAttributeMeta returns AttributeMeta for unmapped types
    const resolved = resolveAttributeMeta(dateTimeMeta);
    console.log('Unmapped type resolved as AttributeMeta:', typeof resolved);
    
    // Pattern matching handles unmapped types gracefully
    const result = matchAttributeMeta(dateTimeMeta, {
        [AttributeType.String]: (stringMeta) => 'string handler',
        [AttributeType.Integer]: (intMeta) => 'integer handler',
        default: (meta) => `unmapped type: ${meta.AttributeType}`
    });
    
    console.log('Pattern match result:', result);
}

/**
 * Test 3: Error handling for mismatched discriminators
 */
export function testDiscriminatorMismatch() {
    // This has mismatched discriminators (String type with Integer name)
    const invalidMeta = createMockAttributeMeta(AttributeType.String, 'IntegerType');
    
    try {
        resolveAttributeMeta(invalidMeta);
        console.error('Should have thrown an error!');
    } catch (error) {
        console.log('Correctly caught discriminator mismatch:', error.message);
    }
}

/**
 * Test 4: Type safety demonstration - now with proper constraints
 */
export function testTypeSafety() {
    const stringMeta = createMockAttributeMeta(AttributeType.String, 'StringType');
    const integerMeta = createMockAttributeMeta(AttributeType.Integer, 'IntegerType');
    
    // Compile-time and runtime safety
    if (isAttributeTypeMapped(stringMeta.AttributeType)) {
        const resolved = resolveAttributeMeta(stringMeta);
        // TypeScript knows this is the specific type, not just AttributeMeta
    }
    
    // Type-safe narrowing - only works with mapped types
    try {
        const narrowedString = narrowAttributeMetaByType(stringMeta, AttributeType.String);
        console.log('Narrowed string meta:', narrowedString.LogicalName);
        
        const narrowedInteger = narrowAttributeMetaByType(integerMeta, AttributeType.Integer);
        console.log('Narrowed integer meta:', narrowedInteger.LogicalName);
        
        // This would be a compile error since DateTime is not in keyof AttributeMetaByType:
        // const narrowedDateTime = narrowAttributeMetaByType(dateTimeMeta, AttributeType.DateTime);
        
    } catch (error) {
        console.error('Narrowing failed:', error);
    }
    
    // Pattern matching with type safety
    const processAttribute = (meta: AttributeMeta) => {
        return matchAttributeMeta(meta, {
            [AttributeType.String]: (stringMeta) => {
                // TypeScript knows this is StringMeta
                return `String attribute: ${stringMeta.LogicalName}`;
            },
            [AttributeType.Integer]: (integerMeta) => {
                // TypeScript knows this is IntegerMeta  
                return `Integer attribute: ${integerMeta.LogicalName}`;
            },
            default: (meta) => {
                // TypeScript knows this is generic AttributeMeta
                return `Generic attribute: ${meta.LogicalName}`;
            }
        });
    };
    
    console.log(processAttribute(stringMeta));
    console.log(processAttribute(integerMeta));
}

/**
 * Run all tests
 */
export function runTypeSafetyTests() {
    console.log('=== Testing Sound Type Narrowing ===');
    
    testMappedTypeResolution();
    testUnmappedTypeResolution(); 
    testDiscriminatorMismatch();
    testTypeSafety();
    
    console.log('=== All tests completed ===');
}
