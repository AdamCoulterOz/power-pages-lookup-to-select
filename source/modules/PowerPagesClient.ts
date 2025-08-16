import pluralize from "pluralize";
import { EntityConfig } from "./Config";
import * as pp from './power-pages/ViewLayout';
import { Data } from "./Data";

interface ODataResponse<T = any> { value: T[]; }
interface PowerPagesShell { getTokenDeferred(): JQuery.Deferred<string>; }
interface ValidateLoginSessionFunction<T> {
    (data: T, textStatus: string, jqXHR: JQuery.jqXHR, callback: Function): void;
}

export default class PowerPagesClient {

    public static Search(entities: EntityConfig[]): (searchTerm: string) => Promise<Data[]> {
        return async (searchTerm: string) => {
            const results = await Promise.all(
                entities.map(async (entity) => {
                    const data = await PowerPagesClient.fetchEntityData(entity, searchTerm);
                    return data.value.map(item => ({
                        Id: item[entity.IdField].toLowerCase(),
                        Name: item[entity.TextField],
                        SetName: entity.SetName,
                        LogicalName: entity.LogicalName,
                        IdField: entity.IdField,
                        TextField: entity.TextField,
                        DisplayName: entity.DisplayName,
                        Values: item
                    } as Data));
                })
            );
            return results.flat();
        };
    }

    private static fetchEntityData<T = any>(entity: EntityConfig, searchTerm: string): Promise<ODataResponse<T>> {
        const queryOptions = PowerPagesClient.createODataQuery(entity, searchTerm);

        return PowerPagesClient.apiRequest<ODataResponse<T>>({
            type: "GET",
            url: `/_api/${entity.SetName}?${queryOptions}`,
            headers: {
                "Prefer": "odata.include-annotations=*"
            }
        });
    }

    private static escOData(s: string) { return s.replace(/'/g, "''"); }

    private static createODataQuery(entity: EntityConfig, searchTerm: string): string {
        const select = `$select=${entity.IdField},${entity.TextField}&$orderby=${entity.TextField} asc`;
        if (!searchTerm) return select;
        const p = PowerPagesClient.escOData(searchTerm);
        return `${select}&$filter=startswith(${entity.TextField},'${p}')`;
        // Optionally: tolower(field) & param aliases if supported
    }

    private static async apiRequest<T>(options: JQuery.AjaxSettings): Promise<T> {
        const token = await PowerPagesClient.shell.getTokenDeferred();

        options.headers = {
            ...options.headers,
            "__RequestVerificationToken": token
        };

        return new Promise<T>((resolve, reject) => {
            $.ajax(options)
                .done((data, textStatus, jqXHR) => {
                    PowerPagesClient.validateLoginSession(data, textStatus, jqXHR, resolve);
                })
                .fail(reject);
        });
    }

    private static readonly shell: PowerPagesShell = (window as any).shell;
    private static readonly validateLoginSession: <T>(...args: Parameters<ValidateLoginSessionFunction<T>>) => void = (window as any).validateLoginSession as ValidateLoginSessionFunction<any>;

    public static async GetFieldTargets(fieldId: string): Promise<EntityConfig[] | null> {
        const lookupModal = jQuery(`#${fieldId}_lookupmodal`);
        if (lookupModal.length === 0) return null;

        const entityGrid = lookupModal.find('.entity-grid');
        if (entityGrid.length === 0) return null;

        const viewLayoutsData = entityGrid.attr('data-view-layouts');
        if (!viewLayoutsData) return null;

        const viewLayoutReferences = PowerPagesClient.parseViewLayouts(viewLayoutsData);

        if (!viewLayoutReferences || !Array.isArray(viewLayoutReferences)) {
            console.error("Invalid view layout data format or empty array");
            return null;
        }

        const viewLayouts = await PowerPagesClient.fetchFullViewLayouts(viewLayoutReferences, lookupModal);

        if (!viewLayouts || !Array.isArray(viewLayouts)) {
            return null;
        }

        // Extract entity configurations from view layouts
        const entities = viewLayouts.map(layout => {
            const config = layout.Configuration;
            const entityName = config.EntityName;
            const primaryKeyName = config.PrimaryKeyName;

            const textFieldName = PowerPagesClient.getFirstFieldName(layout.Columns);

            // If we cannot determine the text field name, skip this entity
            if (!textFieldName) {
                console.warn(`Unable to determine text field for entity '${entityName}' - no Type 0 columns found in view layout. Manual configuration required.`);
                return null;
            }

            const entitySetName = pluralize(entityName);
            // use of pluralize because for some reason I can't find the plural name in any of the metadata that power pages gives me, ill change this if i find it later.

            return {
                SetName: entitySetName,
                IdField: primaryKeyName,
                TextField: textFieldName,
                LogicalName: entityName,
                DisplayName: layout.ViewName
            } as EntityConfig;
        }).filter((entity): entity is EntityConfig => entity !== null); // Remove any null entities

        return entities.length > 0 ? entities : null;
    }

    private static parseViewLayouts(base64Data: string): pp.ViewLayout[] | null {
        try {
            const jsonString = atob(base64Data);
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Error parsing view layouts data:", error);
            return null;
        }
    }

    private static async fetchFullViewLayouts(viewLayoutReferences: pp.ViewLayout[], lookupModal: JQuery<HTMLElement>): Promise<pp.CompleteViewLayout[]> {
        let viewLayouts: pp.CompleteViewLayout[] = [];
        const lookupDataUrl: string = lookupModal.find('.entity-lookup').data('url');
        for (const layoutRef of viewLayoutReferences) {

            const entityName = PowerPagesClient.getEntityFormViewEntityName();

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
                timezoneOffset: -600, // consider: new Date().getTimezoneOffset()
                customParameters: [],
                entityName: entityName,
            }

            let response = await PowerPagesClient.apiRequest<pp.CompleteViewLayout>({
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

    private static getEntityFormViewEntityName(): string | null {
        const entityNameDiv = document.getElementById("EntityFormView_EntityName");
        return entityNameDiv ? entityNameDiv.attributes.getNamedItem("value")?.value ?? null : null;
    }

    private static getFirstFieldName(columns: pp.Column[]): string | null {
        // Extract the LogicalName from the first Type 0 (viewColumn) from the columns metadata
        if (columns && Array.isArray(columns)) {
            const firstViewColumn = columns.find(column => column.Type === 0);
            if (firstViewColumn && firstViewColumn.LogicalName) {
                return firstViewColumn.LogicalName;
            }
        }
        return null;
    }
}
