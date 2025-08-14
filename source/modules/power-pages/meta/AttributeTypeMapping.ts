import { AttributeType, AttributeTypeNameValue, AttributeMeta } from "./Attribute";
import { BooleanMeta } from "./attributes/Boolean";
import { StringMeta } from "./attributes/String";
import { IntegerMeta } from "./attributes/Integer";
import { LookupMeta } from "./attributes/Lookup";
// Import other attribute types as needed
// import { DateTimeMeta } from "./attributes/DateTime";
// import { DecimalMeta } from "./attributes/Decimal";
// import { DoubleMeta } from "./attributes/Double";
// ... etc

/**
 * Type mapping from AttributeType enum to specific AttributeMeta interfaces
 */
export type AttributeMetaByType = {
    [AttributeType.Boolean]: BooleanMeta;
    [AttributeType.String]: StringMeta;
    [AttributeType.Integer]: IntegerMeta;
    [AttributeType.Lookup]: LookupMeta;
    // Add more mappings as needed:
    // [AttributeType.DateTime]: DateTimeMeta;
    // [AttributeType.Decimal]: DecimalMeta;
    // [AttributeType.Double]: DoubleMeta;
    // [AttributeType.Customer]: CustomerMeta;
    // [AttributeType.Owner]: OwnerMeta;
    // [AttributeType.PickList]: PickListMeta;
    // [AttributeType.State]: StateMeta;
    // [AttributeType.Status]: StatusMeta;
    // [AttributeType.Memo]: MemoMeta;
    // [AttributeType.Money]: MoneyMeta;
    // [AttributeType.UniqueIdentifier]: UniqueIdentifierMeta;
    // [AttributeType.BigInt]: BigIntMeta;
    // [AttributeType.ManagedProperty]: ManagedPropertyMeta;
    // [AttributeType.EntityName]: EntityNameMeta;
};

/**
 * Type mapping from AttributeTypeName to specific AttributeMeta interfaces
 */
export type AttributeMetaByTypeName = {
    'BooleanType': BooleanMeta;
    'StringType': StringMeta;
    'IntegerType': IntegerMeta;
    'LookupType': LookupMeta;
    // Add more mappings as needed:
    // 'DateTimeType': DateTimeMeta;
    // 'DecimalType': DecimalMeta;
    // 'DoubleType': DoubleMeta;
    // 'CustomerType': CustomerMeta;
    // 'OwnerType': OwnerMeta;
    // 'PicklistType': PickListMeta;
    // 'StateType': StateMeta;
    // 'StatusType': StatusMeta;
    // 'MemoType': MemoMeta;
    // 'MoneyType': MoneyMeta;
    // 'UniqueidentifierType': UniqueIdentifierMeta;
    // 'BigIntType': BigIntMeta;
    // 'ManagedPropertyType': ManagedPropertyMeta;
    // 'EntityNameType': EntityNameMeta;
};

/**
 * Union type of all specific AttributeMeta interfaces
 */
export type SpecificAttributeMeta = AttributeMetaByType[keyof AttributeMetaByType];

/**
 * Runtime mapping from AttributeType to AttributeTypeName for validation
 */
export const AttributeTypeToTypeNameMap: Record<AttributeType, AttributeTypeNameValue> = {
    [AttributeType.Boolean]: 'BooleanType',
    [AttributeType.String]: 'StringType',
    [AttributeType.Integer]: 'IntegerType',
    [AttributeType.Lookup]: 'LookupType',
    [AttributeType.Customer]: 'CustomerType',
    [AttributeType.DateTime]: 'DateTimeType',
    [AttributeType.Decimal]: 'DecimalType',
    [AttributeType.Double]: 'DoubleType',
    [AttributeType.Owner]: 'OwnerType',
    [AttributeType.PartyList]: 'PartyListType',
    [AttributeType.PickList]: 'PicklistType',
    [AttributeType.State]: 'StateType',
    [AttributeType.Status]: 'StatusType',
    [AttributeType.Memo]: 'MemoType',
    [AttributeType.Money]: 'MoneyType',
    [AttributeType.UniqueIdentifier]: 'UniqueidentifierType',
    [AttributeType.CalendarRules]: 'CalendarRulesType',
    [AttributeType.Virtual]: 'VirtualType',
    [AttributeType.BigInt]: 'BigIntType',
    [AttributeType.ManagedProperty]: 'ManagedPropertyType',
    [AttributeType.EntityName]: 'EntityNameType'
};

/**
 * Runtime mapping from AttributeTypeName to AttributeType for reverse lookup
 */
export const AttributeTypeNameToTypeMap: Record<AttributeTypeNameValue, AttributeType> = {
    'BooleanType': AttributeType.Boolean,
    'StringType': AttributeType.String,
    'IntegerType': AttributeType.Integer,
    'LookupType': AttributeType.Lookup,
    'CustomerType': AttributeType.Customer,
    'DateTimeType': AttributeType.DateTime,
    'DecimalType': AttributeType.Decimal,
    'DoubleType': AttributeType.Double,
    'OwnerType': AttributeType.Owner,
    'PartyListType': AttributeType.PartyList,
    'PicklistType': AttributeType.PickList,
    'StateType': AttributeType.State,
    'StatusType': AttributeType.Status,
    'MemoType': AttributeType.Memo,
    'MoneyType': AttributeType.Money,
    'UniqueidentifierType': AttributeType.UniqueIdentifier,
    'CalendarRulesType': AttributeType.CalendarRules,
    'VirtualType': AttributeType.Virtual,
    'BigIntType': AttributeType.BigInt,
    'ManagedPropertyType': AttributeType.ManagedProperty,
    'EntityNameType': AttributeType.EntityName,
    'ImageType': AttributeType.Virtual, // Assuming Image maps to Virtual
    'MultiSelectPicklistType': AttributeType.PickList, // Assuming MultiSelect maps to PickList
    'FileType': AttributeType.Virtual, // Assuming File maps to Virtual
    'CustomType': AttributeType.Virtual // Assuming Custom maps to Virtual
};

/**
 * Type guard functions for runtime type checking
 */
export function isAttributeMetaOfType<T extends keyof AttributeMetaByType>(
    meta: AttributeMeta,
    type: T
): meta is AttributeMetaByType[T] {
    return meta.AttributeType === type;
}

export function isAttributeMetaOfTypeName<T extends keyof AttributeMetaByTypeName>(
    meta: AttributeMeta,
    typeName: T
): meta is AttributeMetaByTypeName[T] {
    return meta.AttributeTypeName.Value === typeName;
}

/**
 * Set of AttributeTypes that have specific mapped interfaces
 */
const MappedAttributeTypes = new Set<AttributeType>([
    AttributeType.Boolean,
    AttributeType.String,
    AttributeType.Integer,
    AttributeType.Lookup,
    // Add more as you implement them:
    // AttributeType.DateTime,
    // AttributeType.Decimal,
    // AttributeType.Double,
    // etc.
]);

/**
 * Type guard to check if an AttributeType has a specific mapped interface
 */
export function isAttributeTypeMapped(attributeType: AttributeType): attributeType is keyof AttributeMetaByType {
    return MappedAttributeTypes.has(attributeType);
}

/**
 * Runtime type resolver that validates both discriminators match
 * Overloaded to only narrow when AttributeType is in our mapped subset
 */
export function resolveAttributeMeta<T extends AttributeMeta>(
    meta: T
): T extends { AttributeType: keyof AttributeMetaByType } ? AttributeMetaByType[T['AttributeType']] : T;
export function resolveAttributeMeta(meta: AttributeMeta): AttributeMeta;
export function resolveAttributeMeta(meta: AttributeMeta): AttributeMeta {
    const expectedTypeName = AttributeTypeToTypeNameMap[meta.AttributeType];
    const actualTypeName = meta.AttributeTypeName.Value;
    
    if (expectedTypeName !== actualTypeName) {
        throw new Error(
            `Attribute metadata mismatch: AttributeType ${meta.AttributeType} ` +
            `expects TypeName '${expectedTypeName}' but got '${actualTypeName}'`
        );
    }
    
    // Only cast to specific type if it's in our mapped subset
    if (isAttributeTypeMapped(meta.AttributeType)) {
        return meta as SpecificAttributeMeta;
    }
    
    // Otherwise return as generic AttributeMeta
    return meta;
}

/**
 * Safe type narrowing function with validation using AttributeType enum
 * Restricted to only mapped attribute types
 */
export function narrowAttributeMetaByType<T extends keyof AttributeMetaByType>(
    meta: AttributeMeta,
    expectedType: T
): AttributeMetaByType[T] {
    if (meta.AttributeType !== expectedType) {
        throw new Error(
            `Expected AttributeType ${expectedType} but got ${meta.AttributeType}`
        );
    }
    
    // Since T is constrained to keyof AttributeMetaByType, this is safe
    const resolved = resolveAttributeMeta(meta);
    return resolved as AttributeMetaByType[T];
}

/**
 * Helper function to safely invoke a handler with the correct resolved meta type
 */
function invokeHandlerForType<K extends keyof AttributeMetaByType, R>(
    attributeType: K,
    resolvedMeta: SpecificAttributeMeta,
    handlers: { [T in keyof AttributeMetaByType]?: (meta: AttributeMetaByType[T]) => R }
): R | undefined {
    const handler = handlers[attributeType];
    if (handler) {
        return handler(resolvedMeta as AttributeMetaByType[K]);
    }
    return undefined;
}

/**
 * Pattern matching function for handling different attribute types
 * Now uses resolved meta and properly narrowed keys
 */
export function matchAttributeMeta<R>(
    meta: AttributeMeta,
    handlers: {
        [K in keyof AttributeMetaByType]?: (meta: AttributeMetaByType[K]) => R;
    } & {
        default?: (meta: AttributeMeta) => R;
    }
): R {
    // Only try to resolve if the type is mapped
    if (isAttributeTypeMapped(meta.AttributeType)) {
        const resolvedMeta = resolveAttributeMeta(meta);
        
        // Since we've confirmed the type is mapped, we know resolvedMeta is SpecificAttributeMeta
        // Use helper function for type-safe handler invocation
        const result = invokeHandlerForType(meta.AttributeType, resolvedMeta as SpecificAttributeMeta, handlers);
        if (result !== undefined) {
            return result;
        }
    }
    
    if (handlers.default) {
        return handlers.default(meta);
    }
    
    throw new Error(`No handler provided for AttributeType ${meta.AttributeType}`);
}

/**
 * Utility function to get the expected type name for a given attribute type
 */
export function getExpectedTypeName(attributeType: AttributeType): AttributeTypeNameValue {
    return AttributeTypeToTypeNameMap[attributeType];
}

/**
 * Utility function to validate an attribute meta object
 */
export function validateAttributeMeta(meta: AttributeMeta): boolean {
    try {
        resolveAttributeMeta(meta);
        return true;
    } catch {
        return false;
    }
}
