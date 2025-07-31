/**
 * Main plugin implementation
 */
import * as Select2 from 'select2';
import { 
    LookupToSelectOptions, 
    LookupToSelectSettings, 
    DataItemWithMetadata 
} from './types';
import { setLookupValues } from './utils';
import { processConfiguration } from './config-processor';
import { createPolymorphicDataFunction } from './data-service';
import { processResults } from './data-processor';

/**
 * Creates and configures the Select2 instance
 */
export function createSelect2Instance(
    fieldId: string,
    settings: LookupToSelectSettings
): JQuery {
    // generate select element to which select2 will be attached
    const customSelectId = `${fieldId}_dwcSelect2`;
    const sel = jQuery(`<select id='${customSelectId}'>`);
    
    return sel;
}

/**
 * Handles initial value setup
 */
export function setupInitialValue(
    sel: JQuery,
    fieldId: string,
    settings: LookupToSelectSettings,
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
export function createSelect2Config(settings: LookupToSelectSettings): Select2.Options {
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
            transport: function (params: any, success: (data: any) => void, failure: (error: any) => void) {
                settings.getData!(params.data.term, success, failure);
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
export function setupChangeHandler(sel: JQuery, fieldId: string, customSelectId: string): void {
    sel.on("change", function () {
        const selectedValue = sel.val() as string;
        const selectedOption = jQuery(`#${customSelectId} option:selected`);
        const selectedValueLabel = selectedOption.text();
        const selectedData = selectedOption.data('select2-data') as DataItemWithMetadata;

        // Use the helper function to set all lookup values
        const logicalName = selectedData && selectedData._targetTableLogicalName ? selectedData._targetTableLogicalName : undefined;
        setLookupValues(fieldId, selectedValue, selectedValueLabel, logicalName);
    });
}

/**
 * Main plugin implementation
 */
export function lookupToSelect(this: JQuery, options: LookupToSelectOptions = {}): JQuery {
    const fieldId = this.attr('id');
    if (!fieldId) {
        throw new Error("lookupToSelect error: Element must have an id attribute");
    }
    
    // Process and validate configuration
    const processedOptions = processConfiguration(options, fieldId);
    
    // Create settings with defaults
    const settings: LookupToSelectSettings = jQuery.extend({
        placeholder: "Search by typing",
        delay: 250
    }, processedOptions);

    // handle data retrieval if getData function is not provided
    if (!settings.getData && !settings.data && settings.entities) {
        // All lookups are now handled the same way (polymorphic approach)
        settings.getData = createPolymorphicDataFunction(settings.entities);
    }

    // Create and setup Select2 instance
    const sel = createSelect2Instance(fieldId, settings);
    this.parent().after(sel);
    
    // Setup initial value
    setupInitialValue(sel, fieldId, settings, this);
    
    // Create Select2 configuration
    const select2Config = createSelect2Config(settings);
    
    // Initialize Select2
    sel.select2(select2Config);
    
    // Setup change handler
    const customSelectId = `${fieldId}_dwcSelect2`;
    setupChangeHandler(sel, fieldId, customSelectId);

    // make select2 responsive
    jQuery(`#${customSelectId}`).parent().find(".select2").css("width", "100%");

    // hide original lookup
    this.parent().hide();

    return this;
}
