/**
 * Utility functions for Power Pages Lookup to Select
 */
import { PowerPagesShell, ValidateLoginSessionFunction } from './types';

declare const shell: PowerPagesShell;
declare const validateLoginSession: ValidateLoginSessionFunction;

/**
 * Safe AJAX wrapper that handles Power Pages authentication tokens
 */
export function safeAjax(ajaxOptions: JQuery.AjaxSettings): JQuery.Promise<any> {
    const deferredAjax = jQuery.Deferred<any>();

    shell.getTokenDeferred().done(function (token: string) {
        // add headers for AJAX
        if (!ajaxOptions.headers) {
            jQuery.extend(ajaxOptions, {
                headers: {
                    "__RequestVerificationToken": token
                }
            });
        } else {
            ajaxOptions.headers["__RequestVerificationToken"] = token;
        }
        jQuery.ajax(ajaxOptions)
            .done(function (data: any, textStatus: string, jqXHR: JQuery.jqXHR) {
                validateLoginSession(data, textStatus, jqXHR, deferredAjax.resolve);
            }).fail(deferredAjax.reject); //AJAX
        }).fail(function (this: any) {
            deferredAjax.rejectWith(this, arguments); // on token failure pass the token AJAX and args
        });
    
    return deferredAjax.promise();
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
