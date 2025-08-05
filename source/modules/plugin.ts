import * as Select2 from 'select2';
import { 
    LookupToSelectOptions, 
    LookupToSelectSettings} from './types';
import { Data, DVEntity } from './power-pages/types';
import { setLookupValues } from './power-pages/types';
import { processConfiguration } from './config-processor';
import { entitySearchFunc } from './data-service';
import { processResults } from './data-processor';

/**
 * Main plugin implementation
 */
export async function lookupToSelect<T extends DVEntity = DVEntity>(this: JQuery, options: LookupToSelectOptions<T> = {}): Promise<JQuery> {
    const fieldId = this.attr('id');
    if (!fieldId) {
        throw new Error("lookupToSelect error: Element must have an id attribute");
    }
    
    // Process and validate configuration
    const processedOptions = await processConfiguration(options, fieldId);
    
    // Create settings with defaults
    const settings: LookupToSelectSettings<T> = jQuery.extend({
        placeholder: "Search by typing",
        delay: 250
    }, processedOptions);

    // handle data retrieval if getData function is not provided
    if (!settings.getData && !settings.data && settings.entities) {
        // All lookups are now handled the same way (polymorphic approach)
        settings.getData = entitySearchFunc<T>(settings.entities);
    }

    const customSelectId = `${fieldId}_lookupToSelect`;

    // Create and setup Select2 instance
    const sel = jQuery(`<select id='${customSelectId}'>`);
    this.parent().after(sel);
    
    // Setup initial value
    setupInitialValue(sel, fieldId, settings, this);
    
    // Create Select2 configuration
    const select2Config = createSelect2Config(settings);
    
    // Initialize Select2
    sel.select2(select2Config);
    
    // Setup change handler
    setupChangeHandler(sel, fieldId, customSelectId);

    // make select2 responsive
    jQuery(`#${customSelectId}`).parent().find(".select2").css("width", "100%");

    // hide original lookup
    this.parent().hide();

    return this;
}

/**
 * Handles initial value setup
 */
function setupInitialValue<T extends DVEntity = DVEntity>(
    sel: JQuery,
    fieldId: string,
    settings: LookupToSelectSettings<T>,
    originalElement: JQuery
): void {
    // Handle initial value - prefer explicit option over DOM extraction
    let initialId: string | undefined;
    let initialText: string | undefined;
    let initialEntityLogicalName: string | undefined;

    if (settings.initialValue) {
        // Use explicitly provided initial value
        initialId = settings.initialValue.id;
        initialText = settings.initialValue.text;
        initialEntityLogicalName = settings.initialValue.entityLogicalName;
    } else {
        // Fall back to DOM extraction (existing behavior)
        initialId = originalElement.val() as string;
        if (initialId) {
            initialText = jQuery(`#${fieldId}_name`).val() as string;
            // Note: entityLogicalName is not extracted from DOM in the fallback case
            // as there's no standard DOM element for it in single-entity scenarios
        }
    }

    if (initialId && initialText) {
        sel.append(`<option value='${initialId}'>${initialText}</option>`);
        
        // Set the initial values in the underlying lookup fields
        setLookupValues(fieldId, initialId, initialText, initialEntityLogicalName);
    }
}

/**
 * Creates the Select2 configuration object
 */
function createSelect2Config<T extends DVEntity = DVEntity>(settings: LookupToSelectSettings<T>): Select2.Options {
    const select2Config: Select2.Options = {
        placeholder: settings.placeholder,
        minimumInputLength: settings.minimumInputLength,
    };

    // local data source config
    if (settings.data) {
        select2Config.data = settings.data;
    }

    // external data source config
    if (settings.getData) {
        select2Config.ajax = {
            // delay request by specified amount
            delay: settings.delay,
            // define custom request logic
            transport: function (params: any) {
                settings.getData!(params.data.term);
            },
            processResults: function (data: any) {
                return processResults(data, settings);
            }
        };
    }

    // custom option rendering
    if (settings.optionRenderer) {
        select2Config.templateResult = settings.optionRenderer;
    }

    // custom result rendering
    if (settings.resultRenderer) {
        select2Config.templateSelection = settings.resultRenderer;
    }

    return select2Config;
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