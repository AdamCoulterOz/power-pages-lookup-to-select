import * as Select2 from 'select2';

// Merged settings interface
export interface LookupToSelectOptions {
    entities?: EntityConfig[];
    format?: Select2.DataFormat[];
    groupByFieldName?: string;
    groupByTextFieldName?: string;
    groupByEntity?: boolean;
    minimumInputLength?: number;
    delay?: number;
    optionRenderer?: OptionRenderer;
    resultRenderer?: ResultRenderer;
}

// Entity configuration for single entity
export interface EntityConfig {
    entitySetName: string;
    idFieldName: string;
    textFieldName: string;
    tableLogicalName: string;
    displayName?: string;
}

// Custom renderer functions
export type OptionRenderer = (result: Select2.DataFormat | Select2.GroupedDataFormat | Select2.LoadingData) => string | JQuery | null;
export type ResultRenderer = (selection: Select2.DataFormat | Select2.GroupedDataFormat | Select2.IdTextPair | Select2.LoadingData, container: JQuery) => string | JQuery;
