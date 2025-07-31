/**
 * Configuration validation and setup utilities
 */
import { LookupToSelectOptions, EntityConfig } from './types';
import { extractEntityConfigFromDOM } from './dom-parser';

/**
 * Validates entity configuration
 */
export function validateEntityConfig(entities: EntityConfig[]): void {
    if (!Array.isArray(entities) || entities.length === 0) {
        throw new Error("lookupToSelect error: entities must be a non-empty array");
    }
    
    entities.forEach((entity, index) => {
        if (!entity.entitySetName) {
            throw new Error(`lookupToSelect error: entitySetName is required for entity at index ${index}`);
        }
        if (!entity.idFieldName) {
            throw new Error(`lookupToSelect error: idFieldName is required for entity at index ${index}`);
        }
        if (!entity.textFieldName) {
            throw new Error(`lookupToSelect error: textFieldName is required for entity at index ${index}`);
        }
        if (!entity.targetTableLogicalName) {
            throw new Error(`lookupToSelect error: targetTableLogicalName is required for entity at index ${index}`);
        }
    });
}

/**
 * Processes and validates configuration options
 */
export function processConfiguration(options: LookupToSelectOptions, fieldId: string): LookupToSelectOptions {
    // Try to extract configuration from DOM first
    const extractedEntities = extractEntityConfigFromDOM(fieldId);
    
    // Determine if we have explicit configuration or should use extracted data
    const hasExplicitConfig = options.entitySetName || options.entities || options.data || options.getData;
    
    if (!hasExplicitConfig && !extractedEntities) {
        throw new Error("lookupToSelect error: No configuration provided and unable to extract configuration from DOM. Please provide entitySetName/entities or ensure the lookup modal exists in DOM.");
    }

    // Use extracted entities if no explicit configuration is provided
    if (!hasExplicitConfig && extractedEntities) {
        // Always use polymorphic configuration, even for single entities
        options.entities = extractedEntities;
    }

    // Convert single entity configuration to polymorphic format for consistency
    if (options.entitySetName && !options.entities) {
        options.entities = [{
            entitySetName: options.entitySetName,
            idFieldName: options.idFieldName!,
            textFieldName: options.textFieldName!,
            targetTableLogicalName: options.targetTableLogicalName!,
            displayName: options.displayName || options.targetTableLogicalName!
        }];
        
        // Clear the single entity properties to avoid confusion
        delete options.entitySetName;
        delete options.idFieldName;
        delete options.textFieldName;
        delete options.targetTableLogicalName;
    }

    // Validate configuration - now everything uses entities array
    if (!options.entities && !options.data && !options.getData) {
        throw new Error("lookupToSelect error: entities configuration is required for external data source if no getData is provided");
    }

    // validate entities configuration
    if (options.entities) {
        validateEntityConfig(options.entities);
    }

    return options;
}
