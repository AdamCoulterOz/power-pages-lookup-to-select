/**
 * DOM parsing utilities for extracting Power Pages configuration
 */
import pluralize from 'pluralize';
import { ViewLayout, ViewLayoutColumn, EntityConfig } from './types';

/**
 * Helper function to parse base64 encoded view layouts
 */
export function parseViewLayouts(base64Data: string): ViewLayout[] | null {
    try {
        const jsonString = atob(base64Data);
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing view layouts data:", error);
        return null;
    }
}

/**
 * Helper function to determine text field name based on entity type and columns
 */
export function getTextFieldName(entityName: string, columns: ViewLayoutColumn[]): string | null {
    // Extract the LogicalName from the first Type 0 (viewColumn) from the columns metadata
    if (columns && Array.isArray(columns)) {
        const firstViewColumn = columns.find(column => column.Type === 0);
        if (firstViewColumn && firstViewColumn.LogicalName) {
            return firstViewColumn.LogicalName;
        }
    }

    // If no column metadata is available, we cannot safely determine the text field
    // Return null to indicate that manual configuration is required
    return null;
}

/**
 * Helper function to extract entity configuration from DOM
 */
export function extractEntityConfigFromDOM(fieldId: string): EntityConfig[] | null {
    const lookupModal = jQuery(`#${fieldId}_lookupmodal`);
    if (lookupModal.length === 0) {
        return null;
    }

    const entityGrid = lookupModal.find('.entity-grid');
    if (entityGrid.length === 0) {
        return null;
    }

    const viewLayoutsData = entityGrid.attr('data-view-layouts');
    if (!viewLayoutsData) {
        return null;
    }

    const viewLayouts = parseViewLayouts(viewLayoutsData);
    if (!viewLayouts || !Array.isArray(viewLayouts)) {
        return null;
    }

    // Extract entity configurations from view layouts
    const entities = viewLayouts.map(layout => {
        const config = layout.Configuration;
        const entityName = config.EntityName;
        const primaryKeyName = config.PrimaryKeyName;
        
        // Determine the text field name from column metadata
        // This extracts the LogicalName from the first Type: 0 (viewColumn) 
        // which represents the primary display field for the entity in this view
        const textFieldName = getTextFieldName(entityName, layout.Columns);
        
        // If we cannot determine the text field name, skip this entity
        if (!textFieldName) {
            console.warn(`Unable to determine text field for entity '${entityName}' - no Type 0 columns found in view layout. Manual configuration required.`);
            return null;
        }
        
        // Generate entity set name (pluralize)
        const entitySetName = pluralize(entityName);

        return {
            entitySetName: entitySetName,
            idFieldName: primaryKeyName,
            textFieldName: textFieldName,
            targetTableLogicalName: entityName,
            displayName: layout.ViewName || entityName,
            viewId: layout.Id
        } as EntityConfig;
    }).filter((entity): entity is EntityConfig => entity !== null); // Remove any null entities

    return entities.length > 0 ? entities : null;
}
