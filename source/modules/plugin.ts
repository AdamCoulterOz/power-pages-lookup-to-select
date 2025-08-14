import * as Select2 from 'select2';
import { Data, DVEntity } from './power-pages/types';
import { processConfiguration } from './config-processor';
import { entitySearchFunc } from './data-service';
import { processResults } from './data-processor';
import { LookupToSelectOptions } from './types';

export async function lookupToSelect(this: JQuery, options: LookupToSelectOptions = {}): Promise<JQuery> {

    const fieldId = this.attr('id');
    if (!fieldId) throw new Error("lookupToSelect error: Element must have an id attribute");

    // Process and validate configuration
    const processedOptions = await processConfiguration(fieldId, options);

    // Create settings with defaults
    const settings: LookupToSelectOptions = jQuery.extend({
        placeholder: "Search by typing",
        delay: 250
    }, processedOptions);

    const customSelectId = `${fieldId}_lookupToSelect`;

    // Create and setup Select2 instance
    const select2 = jQuery(`<select id='${customSelectId}'>`);
    this.parent().after(select2);

    // Create Select2 configuration
    const select2Config = createSelect2Config(settings);

    // Initialize Select2
    select2.select2(select2Config);

    // Setup change handler
    setupChangeHandler(select2, fieldId, customSelectId);

    // make select2 responsive
    jQuery(`#${customSelectId}`).parent().find(".select2").css("width", "100%");

    // hide original lookup
    this.parent().hide();

    return this;
}

interface S2RequestParameters extends JQueryAjaxSettings { data: { term: string; }; }

/**
 * Creates the Select2 configuration object
 */
function createSelect2Config(settings: LookupToSelectOptions): Select2.Options {

    if (!settings.entities || settings.entities.length === 0)
        settings.entities = lookupEntities();

    const dataRetriever = entitySearchFunc(settings.entities)

    return {
        minimumInputLength: settings.minimumInputLength,
        data: settings.format,
        templateResult: settings.optionRenderer,
        templateSelection: settings.resultRenderer,
        ajax: {
            delay: settings.delay,
            transport: function (params: S2RequestParameters) {
                dataRetriever(params.data.term);
            } as any, // any to handle the S2RequestParameters not matching the expected type
            processResults: function (data: any) {
                return processResults(data, settings);
            }
        }
    };
}

/**
 * Sets up the change event handler
 */
function setupChangeHandler<T extends DVEntity>(sel: JQuery, fieldId: string, customSelectId: string): void {
    sel.on("change", function () {
        const selectedValue = sel.val() as string;
        const selectedOption = jQuery(`#${customSelectId} option:selected`);
        const selectedValueLabel = selectedOption.text();
        const selectedData = selectedOption.data('select2-data') as Data<T>;

        // Use the helper function to set all lookup values
        const logicalName = selectedData && selectedData.tableLogicalName ? selectedData.tableLogicalName : undefined;
        setLookupValues(fieldId, selectedValue, selectedValueLabel, logicalName);
    });
}

/**
 * Helper function to set lookup field values
 */
function setLookupValues(baseId: string, value: string, text: string, logicalName?: string): void {
    jQuery(`#${baseId}`).val(value);
    jQuery(`#${baseId}_name`).val(text);
    if (logicalName) {
        jQuery(`#${baseId}_entityname`).val(logicalName);
    }
    jQuery(`#${baseId}`).trigger("change");
}

function lookupEntities(): import("./types").EntityConfig[] {
    return [];
}

