/**
 * Represents the global `shell` object exposed by Power Pages.
 *
 * `getTokenDeferred()` is a function that returns a jQuery `Deferred<string>` which resolves to the
 * current anti-forgery (CSRF) token needed to authenticate AJAX requests to Power Pages backend APIs.
 *
 * Internally, this:
 * - Looks for a hidden input at `#antiforgerytoken input[name="__RequestVerificationToken"]`
 * - If not present, fetches the token from `#antiforgerytoken[data-url]` via AJAX
 * - Batches concurrent requests until the token is refreshed
 *
 * @example
 * shell.getTokenDeferred().done(token => {
 *   $.ajax({
 *     url: '/_api/entity',
 *     headers: { "__RequestVerificationToken": token }
 *   });
 * });
 */
export interface PowerPagesShell {
    getTokenDeferred(): JQuery.Deferred<string>;
}

export interface ValidateLoginSessionFunction<T> {
    (data: T, textStatus: string, jqXHR: JQuery.jqXHR, callback: Function): void;
}

export interface ODataResponse<T = any> {
    value: T[];
}

export interface Metadata {
  entitySetName: string;
  tableLogicalName: string;
  idFieldName: string;
  textFieldName: string;
  entityDisplayName: string;
}

export type Data<T extends DVEntity = DVEntity> = T & Metadata;

export interface DVEntity {
    "@odata.etag": string;
    id: string;
    name: string;
    createdby: Date;
    createdon: Date;
    modifiedby: Date;
    modifiedon: Date;
    statecode: number;
    statuscode: number;
    importsequencenumber: number;
}

declare const shell: PowerPagesShell;
declare const validateLoginSession: <T>(...args: Parameters<ValidateLoginSessionFunction<T>>) => void;


  

/**
 * Safe AJAX wrapper that handles Power Pages authentication tokens
 */
export async function safeAjax<T>(ajaxOptions: JQuery.AjaxSettings): Promise<T> {
    const token = await shell.getTokenDeferred();

    ajaxOptions.headers = {
        ...ajaxOptions.headers,
        "__RequestVerificationToken": token
    };

    return new Promise<T>((resolve, reject) => {
        $.ajax(ajaxOptions)
            .done((data, textStatus, jqXHR) => {
                validateLoginSession(data, textStatus, jqXHR, resolve);
            })
            .fail(reject);
    });
}

/**
 * Helper function to set lookup field values
 */
export function setLookupValues(baseId: string, value: string, text: string, logicalName?: string): void {
    jQuery(`#${baseId}`).val(value);
    jQuery(`#${baseId}_name`).val(text);
    if (logicalName) {
        jQuery(`#${baseId}_entityname`).val(logicalName);
    }
    jQuery(`#${baseId}`).trigger("change");
}

