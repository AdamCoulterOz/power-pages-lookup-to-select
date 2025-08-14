/**
 * Data service for API calls and data retrieval
 */
import { EntityConfig } from './types';
import { Data, DVEntity } from './power-pages/types';
import { safeAjax } from './power-pages/types';

export interface ODataResponse<T = any> {
    value: T[];
}

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
export function fetchEntityData<T>(entity: EntityConfig, searchTerm: string): Promise<ODataResponse<T>> {
    const queryOptions = createODataQuery(entity, searchTerm);

    return safeAjax<ODataResponse<T>>({
        type: "GET",
        url: `/_api/${entity.entitySetName}?${queryOptions}`,
        contentType: "application/json",
        headers: {
            "Prefer": "odata.include-annotations=*"
        }
    });
}

// getData function signature
export type GetDataFunction<T extends DVEntity> = (searchTerm: string) => Promise<Data<T>[]>;

/**
 * Creates a getData function for multiple entities (polymorphic approach)
 */
export function entitySearchFunc<T extends DVEntity = DVEntity>(entities: EntityConfig[]): (searchTerm: string) => Promise<Data<T>[]> {
    return async (searchTerm: string) => {
        const results = await Promise.all(
            entities.map(async (entity) => {
                const data = await fetchEntityData<any>(entity, searchTerm);
                return data.value.map(item => ({
                    ...item,
                    id: item[entity.idFieldName],
                    name: item[entity.textFieldName],
                    createdby: new Date(item.createdby),
                    createdon: new Date(item.createdon),
                    modifiedby: new Date(item.modifiedby),
                    modifiedon: new Date(item.modifiedon),
                    entitySetName: entity.entitySetName,
                    tableLogicalName: entity.tableLogicalName,
                    idFieldName: entity.idFieldName,
                    textFieldName: entity.textFieldName,
                    entityDisplayName: entity.displayName || entity.tableLogicalName
                } as Data<T>));
            })
        );
        return results.flat();
    };
}
