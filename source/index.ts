/**
 * Power Pages Lookup to Select - Modular Implementation
 * 
 * Main entry point that combines all modules
 */
import { lookupToSelect } from './modules/plugin';
import { DVEntity } from './modules/power-pages/types';
import { 
    LookupToSelectOptions, 
    EntityConfig, 
    GetDataFunction 
} from './modules/types';

// Extend jQuery interface
declare global {
    interface JQuery {
        lookupToSelect<T extends DVEntity = DVEntity>(options?: LookupToSelectOptions<T>): Promise<JQuery>;
    }
}

// Attach to jQuery
jQuery.fn.lookupToSelect = lookupToSelect;

// Export for module usage
export default jQuery.fn.lookupToSelect;
export { LookupToSelectOptions, EntityConfig, GetDataFunction };

// Re-export all types and utilities for advanced usage
export * from './modules/types';
export * from './modules/dom-parser';
export * from './modules/data-service';
export * from './modules/data-processor';
export * from './modules/config-processor';
export * from './modules/plugin';
