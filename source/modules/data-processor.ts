import * as Select2 from 'select2';
import { LookupToSelectSettings } from './types';
import { Data, DVEntity, ODataResponse } from './power-pages/types';

/**
 * Processes data for grouping by custom field
 */
export function processGroupByField<T extends DVEntity = DVEntity>(
    data: Data<T>[], 
    groupByFieldName: string, 
    groupByTextFieldName?: string
): Select2.GroupedDataFormat[] {
    const grouped = data.reduce((acc: Record<string, Select2.GroupedDataFormat>, el: Data<T>) => {
        const formattedElement: Select2.DataFormat & Data<T> = jQuery.extend(
            {
                id: el.id,
                text: el.name
            },
            el
        );

        const groupValue = String(formattedElement[groupByFieldName as keyof typeof formattedElement]);
        const groupText = String(formattedElement[(groupByTextFieldName || groupByFieldName) as keyof typeof formattedElement]);
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
export function processGroupByEntity<T extends DVEntity>(data: Data<T>[]): Select2.GroupedDataFormat[] {
    const grouped = data.reduce((acc: Record<string, Select2.GroupedDataFormat>, el: Data<T>) => {
        const entityDisplayName = el.entityDisplayName;

        const formattedElement: Select2.DataFormat & Data<T> = jQuery.extend(
            {
                id: el.id,
                text: el.name
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
export function processFlatList<T extends DVEntity>(data: Data<T>[]): (Select2.DataFormat & Data<T>)[] {
    return data.map((el: Data<T>): Select2.DataFormat & Data<T> => {
        return jQuery.extend(
            {
                id: el.id,
                text: el.name
            },
            el
        );
    });
}

/**
 * Main data processing function that handles all grouping scenarios
 */
export function processResults<T extends DVEntity>(data: Data<T>[], settings: LookupToSelectSettings<T>): { results: (Select2.DataFormat | Select2.GroupedDataFormat)[] } {

    let formattedResponse: (Select2.DataFormat | Select2.GroupedDataFormat)[];
    const isSingleEntity = settings.entities?.length === 1;

    // grouping results if groupBy is provided
    if (settings.groupByFieldName) {
        formattedResponse = processGroupByField(data, settings.groupByFieldName, settings.groupByTextFieldName);
    } else if (!isSingleEntity && settings.groupByEntity !== false) {
        // group by entity type for multi-entity lookups (default behavior)
        formattedResponse = processGroupByEntity(data);
    } else {
        // flat list (single entity or groupByEntity disabled)
        formattedResponse = processFlatList(data);
    }

    return { results: formattedResponse };
}
