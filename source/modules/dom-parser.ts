/**
 * DOM parsing utilities for extracting Power Pages configuration
 */
import pluralize from 'pluralize';
import { EntityConfig } from './types';
import * as pp from './power-pages/ViewLayout';
import { safeAjax } from './power-pages/types';

export function getEntityFormViewEntityName() : string | null
{
    const entityNameDiv = document.getElementById("EntityFormView_EntityName");
    return entityNameDiv ? entityNameDiv.attributes.getNamedItem("value")?.value ?? null : null;
}

/**
 * Helper function to parse base64 encoded view layouts
 */
export function parseViewLayouts(base64Data: string): pp.ViewLayout[] | null {
    try {
        const jsonString = atob(base64Data);
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing view layouts data:", error);
        return null;
    }
}

export async function fetchFullViewLayouts(viewLayoutReferences: pp.ViewLayout[], lookupModal: JQuery<HTMLElement>): Promise<pp.CompleteViewLayout[]> {
    let viewLayouts: pp.CompleteViewLayout[] = [];
    const lookupDataUrl : string = lookupModal.find('.entity-lookup').data('url');
    for (const layoutRef of viewLayoutReferences) {

        const entityName = getEntityFormViewEntityName();

        let request = {
            base64SecureConfiguration: layoutRef.Base64SecureConfiguration,
            sortExpression: "",
            search: "",
            page: 1,
            pageSize: 10,
            pagingCookie: "",
            filter: null,
            metaFilter: null,
            nlSearchFilter: null,
            timezoneOffset: -600,
            customParameters: [],
            entityName: entityName,
        }

        let response = await safeAjax<pp.CompleteViewLayout>({
            type: "POST",
            url: lookupDataUrl,
            contentType: "application/json",
            data: JSON.stringify(request)
        });

        if (response && response.Configuration) {
            viewLayouts.push(response);
        }
    }

    return viewLayouts;
}

/**
 * Helper function to determine text field name based on entity type and columns
 */
export function getFirstFieldName(columns: pp.Column[]): string | null {
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
export async function extractEntityConfigFromDOM(fieldId: string): Promise<EntityConfig[] | null> {
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

    const viewLayoutReferences = parseViewLayouts(viewLayoutsData);

    if( !viewLayoutReferences || !Array.isArray(viewLayoutReferences)) {
        console.error("Invalid view layout data format or empty array");
        return null;
    }

    const viewLayouts = await fetchFullViewLayouts(viewLayoutReferences, lookupModal);

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
        const textFieldName = getFirstFieldName(layout.Columns);

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
            tableLogicalName: entityName,
            displayName: layout.ViewName || entityName
        } as EntityConfig;
    }).filter((entity): entity is EntityConfig => entity !== null); // Remove any null entities

    return entities.length > 0 ? entities : null;
}
