/**
 * Data service for API calls and data retrieval
 */
import { EntityConfig, ODataResponse, DataItemWithMetadata } from './types';
import { safeAjax } from './utils';

/**
 * Helper function to create OData query for an entity
 */
export function createODataQuery(entity: EntityConfig, searchTerm: string): string {
    const select = `$select=${entity.idFieldName},${entity.textFieldName}&$orderby=${entity.textFieldName} asc`;
    const filter = searchTerm ? `&$filter=startswith(${entity.textFieldName},'${searchTerm}')` : "";
    return select + filter;
}

/**
 * Helper function to make API call for a single entity
 */
export function fetchEntityData(entity: EntityConfig, searchTerm: string): Promise<ODataResponse> {
    return new Promise((resolve, reject) => {
        const queryOptions = createODataQuery(entity, searchTerm);

        safeAjax({
            type: "GET",
            url: `/_api/${entity.entitySetName}?${queryOptions}`,
            contentType: "application/json",
            headers: {
                "Prefer": "odata.include-annotations=*"
            },
            success: function(data: ODataResponse) {
                resolve(data);
            },
            error: reject
        });
    });
}

/**
 * Creates a getData function for multiple entities (polymorphic approach)
 */
export function createPolymorphicDataFunction(entities: EntityConfig[]) {
    return function (searchTerm: string, successHandler: (data: ODataResponse) => void, errorHandler: (error: any) => void): void {
        const promises = entities.map(entity => {
            return fetchEntityData(entity, searchTerm).then(data => {
                // add entity metadata to each result
                const enrichedData: DataItemWithMetadata[] = data.value.map(item => ({
                    ...item,
                    _entitySetName: entity.entitySetName,
                    _targetTableLogicalName: entity.targetTableLogicalName,
                    _idFieldName: entity.idFieldName,
                    _textFieldName: entity.textFieldName,
                    _entityDisplayName: entity.displayName || entity.targetTableLogicalName
                }));
                return { value: enrichedData };
            });
        });

        Promise.all(promises)
            .then(results => {
                // combine all results
                const combinedData: ODataResponse = {
                    value: results.reduce((acc, result) => acc.concat(result.value), [] as DataItemWithMetadata[])
                };
                successHandler(combinedData);
            })
            .catch(errorHandler);
    };
}
