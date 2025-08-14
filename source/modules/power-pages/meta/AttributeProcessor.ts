import { LookupData, EntityRecord, Attribute, Type } from "../LookupData";
import { AttributeType } from "./Attribute";
import {
    narrowAttributeMetaByType,
    isAttributeMetaOfType,
    validateAttributeMeta,
} from "./AttributeTypeMapping";

/**
 * Maps LookupData.Type enum to AttributeType enum
 */
function mapTypeToAttributeType(type: Type): AttributeType {
    switch (type) {
        case Type.BigInt:
            return AttributeType.BigInt;
        case Type.Boolean:
            return AttributeType.Boolean;
        case Type.Customer:
            return AttributeType.Customer;
        case Type.DateTime:
            return AttributeType.DateTime;
        case Type.Decimal:
            return AttributeType.Decimal;
        case Type.Double:
            return AttributeType.Double;
        case Type.Integer:
            return AttributeType.Integer;
        case Type.Lookup:
            return AttributeType.Lookup;
        case Type.Memo:
            return AttributeType.Memo;
        case Type.Money:
            return AttributeType.Money;
        case Type.String:
            return AttributeType.String;
        case Type.UniqueIdentifier:
            return AttributeType.UniqueIdentifier;
        case Type.OptionSet:
            return AttributeType.PickList; // OptionSet maps to PickList
        case Type.State:
            return AttributeType.State;
        case Type.Status:
            return AttributeType.Status;
        case Type.Owner:
            return AttributeType.Owner;
        case Type.File:
            return AttributeType.Virtual; // File maps to Virtual
        case Type.Image:
            return AttributeType.Virtual; // Image maps to Virtual
        case Type.MultiSelectPicklist:
            return AttributeType.PickList; // MultiSelectPicklist maps to PickList
        default:
            return AttributeType.Virtual; // Default fallback
    }
}

/**
 * Safely extracts the actual value from an Attribute, handling both nested and direct value structures
 */
function extractAttributeValue(attribute: Attribute): any {
    // Handle both possible structures:
    // 1. Nested: { Value: { Value: actualValue } }  (theoretical from types)
    // 2. Direct: { Value: actualValue }             (likely actual runtime)
    const value = attribute.Value;

    // If value has a nested Value property, use that
    if (value && typeof value === 'object' && 'Value' in value) {
        return (value as any).Value;
    }

    // Otherwise, the value is direct
    return value;
}

/**
 * Smart value extraction that preserves labels for option-like types
 * but unwraps simple values for primitive types
 * 
 * Design rationale:
 * - OptionSet types (PickList, State, Status): Keep { Value: number, Label?: string } structure
 * - Money types: Keep { Value: number, Currency?: EntityReference } structure  
 * - EntityReference types: Keep { Id: string, Name?: string, LogicalName?: string } structure
 * - Simple types (String, Integer, etc.): Unwrap to primitive values for easier consumption
 */
function extractAttributeValuePreservingLabels(attribute: Attribute): any {
    const attributeType = mapTypeToAttributeType(attribute.Type);
    const value = attribute.Value;

    // For option-like types, preserve the full structure with labels
    if (attributeType === AttributeType.PickList ||
        attributeType === AttributeType.State ||
        attributeType === AttributeType.Status) {
        // Keep the full OptionSet structure: { Value: number, Label?: string }
        return asOptionSet(value) || value;
    }

    // For Money fields, preserve the full structure with currency
    if (attributeType === AttributeType.Money) {
        // Keep the full Money structure: { Value: number, Currency?: EntityReference }
        return asMoney(value) || value;
    }

    // For EntityReference types, preserve the full structure
    if (attributeType === AttributeType.Lookup ||
        attributeType === AttributeType.Customer ||
        attributeType === AttributeType.Owner) {
        // Keep the full EntityReference structure: { Id: string, Name?: string, LogicalName?: string }
        return asEntityReference(value) || value;
    }

    // For simple types, unwrap to the primitive value
    return extractAttributeValue(attribute);
}

/**
 * Type-specific value extractors for better type safety and handling of special cases
 */
export function extractStringValue(attribute: Attribute): string | null {
    const value = extractAttributeValue(attribute);
    return typeof value === 'string' ? value : null;
}

export function extractNumberValue(attribute: Attribute): number | null {
    const value = extractAttributeValue(attribute);
    return typeof value === 'number' ? value : null;
}

export function extractBooleanValue(attribute: Attribute): boolean | null {
    const value = extractAttributeValue(attribute);
    return typeof value === 'boolean' ? value : null;
}

export function extractDateValue(attribute: Attribute): Date | null {
    const value = extractAttributeValue(attribute);
    if (value instanceof Date) {
        return value;
    }
    if (typeof value === 'string') {
        // Handle ISO date strings from Power Pages
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    }
    return null;
}

/**
 * Extract EntityReference-like values (for Customer, Owner, Lookup fields)
 */
export function extractEntityReferenceValue(attribute: Attribute): { Id: string; Name?: string; LogicalName?: string } | null {
    const value = extractAttributeValue(attribute);
    if (value && typeof value === 'object' && 'Id' in value) {
        return value as { Id: string; Name?: string; LogicalName?: string };
    }
    return null;
}

/**
 * Helper functions for common value shapes to avoid re-inferring structure
 */

/**
 * Extract OptionSet value with Label (for PickList, State, Status fields)
 */
export function asOptionSet(v: unknown): { Value: number; Label?: string } | null {
    return v && typeof v === 'object' && 'Value' in (v as any) && typeof (v as any).Value === 'number'
        ? v as any
        : null;
}

/**
 * Extract Money value with Currency (for Money fields)
 * Models Dataverse structure where Currency can be an EntityReference
 */
export function asMoney(v: unknown): { Value: number; Currency?: { Id: string; Name?: string } } | null {
    if (v && typeof v === 'object' && 'Value' in (v as any) && typeof (v as any).Value === 'number') {
        const obj = v as any;
        return {
            Value: obj.Value,
            Currency: obj.Currency && typeof obj.Currency === 'object' && 'Id' in obj.Currency
                ? { Id: obj.Currency.Id, Name: obj.Currency.Name }
                : undefined
        };
    }
    return null;
}

/**
 * Extract Money value with simple currency code (alternative for simpler cases)
 */
export function asMoneyWithCurrencyCode(v: unknown): { Value: number; CurrencyCode?: string } | null {
    if (v && typeof v === 'object' && 'Value' in (v as any) && typeof (v as any).Value === 'number') {
        const obj = v as any;
        return {
            Value: obj.Value,
            CurrencyCode: typeof obj.Currency === 'string' ? obj.Currency : obj.CurrencyCode
        };
    }
    return null;
}

/**
 * Extract EntityReference value (for Lookup, Customer, Owner fields)
 */
export function asEntityReference(v: unknown): { Id: string; Name?: string; LogicalName?: string } | null {
    return v && typeof v === 'object' && 'Id' in (v as any) && typeof (v as any).Id === 'string'
        ? v as any
        : null;
}

/**
 * Example usage of the AttributeTypeMapping system
 */

/**
 * Process a LookupData response with type-safe attribute handling
 */
export function processLookupDataResponse(lookupData: LookupData): ProcessedRecord[] {
    return lookupData.Records.map(record => processRecord(record));
}

export interface ProcessedRecord {
    id: string;
    entityName: string;
    attributes: ProcessedAttribute[];
    metadata: {
        canRead: boolean;
        canWrite: boolean;
        canDelete: boolean;
    };
}

export interface ProcessedAttribute {
    name: string;
    type: AttributeType; // Changed from string to AttributeType enum for stronger typing
    value: any;
    formattedValue?: string;
    displayValue?: string;
    metadata?: any;
}

function processRecord(record: EntityRecord): ProcessedRecord {
    return {
        id: record.Id,
        entityName: record.EntityName,
        attributes: record.Attributes.map(attr => processAttribute(attr)),
        metadata: {
            canRead: record.CanRead,
            canWrite: record.CanWrite,
            canDelete: record.CanDelete
        }
    };
}

function processAttribute(attribute: Attribute): ProcessedAttribute {
    const processed: ProcessedAttribute = {
        name: attribute.Name,
        type: mapTypeToAttributeType(attribute.Type), // Use mapping function for stronger typing
        value: extractAttributeValuePreservingLabels(attribute), // Use label-preserving extraction
        formattedValue: attribute.FormattedValue,
        displayValue: attribute.DisplayValue
    };

    // If we have attribute metadata, process it type-safely
    if (attribute.AttributeMetadata) {
        const meta = attribute.AttributeMetadata;

        // Validate the metadata first
        if (!validateAttributeMeta(meta)) {
            console.warn(`Invalid attribute metadata for ${attribute.Name}`);
            return processed;
        }

        // Simple metadata extraction - focus on safe value extraction
        processed.metadata = {
            logicalName: meta.LogicalName,
            type: processed.type, // Use the mapped AttributeType for consistency
            safeValue: extractAttributeValuePreservingLabels(attribute), // Use label-preserving extraction
            // Add type-specific processing as needed
        };
    }

    return processed;
}

/**
 * Example of type-specific processing functions using the helper functions
 */
export function processStringAttribute(attribute: Attribute): string | null {
    if (attribute.AttributeMetadata && isAttributeMetaOfType(attribute.AttributeMetadata, AttributeType.String)) {
        const stringMeta = attribute.AttributeMetadata;

        // Now we have full type safety for StringMeta
        const maxLength = stringMeta.DatabaseLength;
        const value = extractStringValue(attribute);

        if (maxLength && value && value.length > maxLength) {
            console.warn(`String value exceeds max length of ${maxLength}`);
        }

        return value;
    }

    return extractStringValue(attribute);
}

export function processPickListAttribute(attribute: Attribute): { value: number; label?: string } | null {
    // Use the OptionSet helper function
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
    // Use the Money helper function
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
    // Use the EntityReference helper function
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

export function processIntegerAttribute(attribute: Attribute): number | null {
    if (attribute.AttributeMetadata) {
        try {
            const integerMeta = narrowAttributeMetaByType(attribute.AttributeMetadata, AttributeType.Integer);
            const value = extractNumberValue(attribute);

            if (value === null) {
                return null;
            }

            // Type-safe access to integer-specific properties
            if (integerMeta.MinValue !== undefined && value < integerMeta.MinValue) {
                console.warn(`Integer value ${value} is below minimum ${integerMeta.MinValue}`);
            }

            if (integerMeta.MaxValue !== undefined && value > integerMeta.MaxValue) {
                console.warn(`Integer value ${value} is above maximum ${integerMeta.MaxValue}`);
            }

            return value;
        } catch (error) {
            console.error(`Failed to process integer attribute: ${error}`);
        }
    }

    return null;
}

/**
 * Type-safe attribute filtering and processing utilities
 */
export function filterAttributesByType(attributes: ProcessedAttribute[], type: AttributeType): ProcessedAttribute[] {
    return attributes.filter(attr => attr.type === type);
}

export function groupAttributesByType(attributes: ProcessedAttribute[]): Map<AttributeType, ProcessedAttribute[]> {
    const groups = new Map<AttributeType, ProcessedAttribute[]>();

    for (const attr of attributes) {
        const existing = groups.get(attr.type) || [];
        existing.push(attr);
        groups.set(attr.type, existing);
    }

    return groups;
}

export function processAttributeByType(attribute: ProcessedAttribute): any {
    // Strong typing enables exhaustive switches
    switch (attribute.type) {
        case AttributeType.String:
            return {
                ...attribute,
                isTextual: true,
                length: typeof attribute.value === 'string' ? attribute.value.length : 0
            };
        case AttributeType.Integer:
        case AttributeType.Decimal:
        case AttributeType.Double:
        case AttributeType.BigInt:
            return {
                ...attribute,
                isNumeric: true,
                numericValue: (() => {
                    const n = Number(attribute.value);
                    return Number.isFinite(n) ? n : null;
                })()
            };
        case AttributeType.Boolean:
            return {
                ...attribute,
                isBoolean: true,
                booleanValue: Boolean(attribute.value)
            };
        case AttributeType.DateTime:
            return {
                ...attribute,
                isDate: true,
                dateValue: (() => {
                    const d = new Date(attribute.value as any);
                    return isNaN(d.getTime()) ? null : d;
                })()
            };
        case AttributeType.Lookup:
        case AttributeType.Customer:
        case AttributeType.Owner:
            return {
                ...attribute,
                isReference: true,
                referenceId: attribute.value?.Id || null
            };
        default:
            return {
                ...attribute,
                isOther: true
            };
    }
}

/**
 * Example usage with strong typing:
 * 
 * const lookupResponse: LookupData = await fetchLookupData();
 * const processedRecords = processLookupDataResponse(lookupResponse);
 * 
 * for (const record of processedRecords) {
 *   for (const attr of record.attributes) {
 *     // Now we can use strong typing with AttributeType enum
 *     switch (attr.type) {
 *       case AttributeType.String:
 *         console.log(`String attribute: ${attr.value}`);
 *         break;
 *       case AttributeType.Integer:
 *         console.log(`Integer attribute: ${attr.value}`);
 *         break;
 *       case AttributeType.Boolean:
 *         console.log(`Boolean attribute: ${attr.value}`);
 *         break;
 *       case AttributeType.DateTime:
 *         console.log(`Date attribute: ${attr.value}`);
 *         break;
 *       default:
 *         console.log(`Other type (${attr.type}): ${attr.value}`);
 *     }
 *   }
 * }
 * 
 * // Type-safe filtering
 * const stringAttributes = processedRecords
 *   .flatMap(r => r.attributes)
 *   .filter(attr => attr.type === AttributeType.String);
 * 
 * const numericAttributes = processedRecords
 *   .flatMap(r => r.attributes)
 *   .filter(attr => attr.type === AttributeType.Integer || attr.type === AttributeType.Decimal);
 */
