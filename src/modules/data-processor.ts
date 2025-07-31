/**
 * Data processing utilities for Select2 formatting
 */
import * as Select2 from 'select2';
import { DataItemWithMetadata, ODataResponse, LookupToSelectSettings, EntityConfig } from './types';

/**
 * Normalizes data by adding metadata if missing (for external getData functions)
 */
export function normalizeDataWithMetadata(data: ODataResponse, entities: EntityConfig[]): void {
    if (data && data.value && Array.isArray(data.value) && entities) {
        data.value = data.value.map(item => {
            // If item already has metadata, keep it as-is
            if ((item as DataItemWithMetadata)._entityDisplayName) {
                return item as DataItemWithMetadata;
            }
            
            // Add metadata for external data
            let matchingEntity = entities[0]; // Default fallback
            
            if (entities.length > 1) {
                // Try to match based on which entity's idFieldName exists in the item
                const foundEntity = entities.find(entity => 
                    item.hasOwnProperty(entity.idFieldName)
                );
                if (foundEntity) {
                    matchingEntity = foundEntity;
                }
            }
            
            return {
                ...item,
                _entitySetName: matchingEntity.entitySetName,
                _targetTableLogicalName: matchingEntity.targetTableLogicalName,
                _idFieldName: matchingEntity.idFieldName,
                _textFieldName: matchingEntity.textFieldName,
                _entityDisplayName: matchingEntity.displayName || matchingEntity.targetTableLogicalName
            } as DataItemWithMetadata;
        });
    }
}

/**
 * Processes data for grouping by custom field
 */
export function processGroupByField(
    data: DataItemWithMetadata[], 
    groupByFieldName: string, 
    groupByTextFieldName?: string
): Select2.GroupedDataFormat[] {
    const grouped = data.reduce((acc: Record<string, Select2.GroupedDataFormat>, el: DataItemWithMetadata) => {
        const formattedElement: Select2.DataFormat & DataItemWithMetadata = jQuery.extend(
            {
                id: el[el._idFieldName],
                text: el[el._textFieldName]
            },
            el
        );

        const groupValue = formattedElement[groupByFieldName];
        const groupText = formattedElement[groupByTextFieldName || groupByFieldName];
        if (!acc[groupValue]) {
            acc[groupValue] = {
                text: groupText,
                children: []
            };
        }
        acc[groupValue].children!.push(formattedElement);
        return acc;
    }, {});
    
    return Object.values(grouped);
}

/**
 * Processes data for grouping by entity type
 */
export function processGroupByEntity(data: DataItemWithMetadata[]): Select2.GroupedDataFormat[] {
    const grouped = data.reduce((acc: Record<string, Select2.GroupedDataFormat>, el: DataItemWithMetadata) => {
        const entityDisplayName = el._entityDisplayName;
        
        const formattedElement: Select2.DataFormat & DataItemWithMetadata = jQuery.extend(
            {
                id: el[el._idFieldName],
                text: el[el._textFieldName]
            },
            el
        );

        if (!acc[entityDisplayName]) {
            acc[entityDisplayName] = {
                text: entityDisplayName,
                children: []
            };
        }
        acc[entityDisplayName].children!.push(formattedElement);
        return acc;
    }, {});
    
    return Object.values(grouped);
}

/**
 * Processes data as a flat list
 */
export function processFlatList(data: DataItemWithMetadata[]): (Select2.DataFormat & DataItemWithMetadata)[] {
    return data.map((el: DataItemWithMetadata): Select2.DataFormat & DataItemWithMetadata => {
        return jQuery.extend(
            {
                id: el[el._idFieldName],
                text: el[el._textFieldName]
            },
            el
        );
    });
}

/**
 * Main data processing function that handles all grouping scenarios
 */
export function processResults(data: ODataResponse, settings: LookupToSelectSettings): { results: (Select2.DataFormat | Select2.GroupedDataFormat)[] } {
    // Normalize data by adding metadata if missing (for external getData functions)
    if (settings.entities) {
        normalizeDataWithMetadata(data, settings.entities);
    }

    let formattedResponse: (Select2.DataFormat | Select2.GroupedDataFormat)[];
    const isSingleEntity = settings.entities?.length === 1;

    // grouping results if groupBy is provided
    if (settings.groupByFieldName) {
        formattedResponse = processGroupByField(data.value, settings.groupByFieldName, settings.groupByTextFieldName);
    } else if (!isSingleEntity && settings.groupByEntity !== false) {
        // group by entity type for multi-entity lookups (default behavior)
        formattedResponse = processGroupByEntity(data.value);
    } else {
        // flat list (single entity or groupByEntity disabled)
        formattedResponse = processFlatList(data.value);
    }

    return {
        results: formattedResponse
    };
}
