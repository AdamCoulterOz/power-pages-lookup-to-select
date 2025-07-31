/**
 * Type definitions for Power Pages Lookup to Select
 */
import * as Select2 from 'select2';

// Power Pages global interfaces
export interface PowerPagesShell {
    getTokenDeferred(): JQuery.Deferred<string>;
}

export interface ValidateLoginSessionFunction {
    (data: any, textStatus: string, jqXHR: JQuery.jqXHR, callback: Function): void;
}

// Entity configuration for single entity
export interface EntityConfig {
    entitySetName: string;
    idFieldName: string;
    textFieldName: string;
    targetTableLogicalName: string;
    displayName?: string;
    viewId?: string;
}

// View layout structures from Power Pages DOM
export interface ViewLayoutColumn {
    Type: number;
    LogicalName: string;
    [key: string]: any;
}

export interface ViewLayoutConfiguration {
    EntityName: string;
    PrimaryKeyName: string;
    [key: string]: any;
}

export interface ViewLayout {
    Id: string;
    ViewName: string;
    Configuration: ViewLayoutConfiguration;
    Columns: ViewLayoutColumn[];
    [key: string]: any;
}

// Data item with entity metadata
export interface DataItemWithMetadata {
    [key: string]: any; // Original entity fields
    _entitySetName: string;
    _targetTableLogicalName: string;
    _idFieldName: string;
    _textFieldName: string;
    _entityDisplayName: string;
}

// OData response structure
export interface ODataResponse {
    value: DataItemWithMetadata[];
    [key: string]: any;
}

// getData function signature
export type GetDataFunction = (
    searchTerm: string,
    successHandler: (data: ODataResponse) => void,
    errorHandler: (error: any) => void
) => void;

// Custom renderer functions
export type OptionRenderer = (result: Select2.DataFormat | Select2.GroupedDataFormat | Select2.LoadingData) => string | JQuery | null;
export type ResultRenderer = (selection: Select2.DataFormat | Select2.GroupedDataFormat | Select2.IdTextPair | Select2.LoadingData, container: JQuery) => string | JQuery;

// Plugin options interface
export interface LookupToSelectOptions {
    // Initial value configuration
    initialValue?: {
        id: string;
        text: string;
        entityLogicalName?: string;
    };

    // Single entity configuration (legacy)
    entitySetName?: string;
    idFieldName?: string;
    textFieldName?: string;
    targetTableLogicalName?: string;
    displayName?: string;

    // Polymorphic entity configuration
    entities?: EntityConfig[];

    // Data source options
    data?: Select2.DataFormat[];
    getData?: GetDataFunction;

    // Grouping options
    groupByFieldName?: string;
    groupByTextFieldName?: string;
    groupByEntity?: boolean;

    // Select2 configuration
    placeholder?: string;
    minimumInputLength?: number;
    delay?: number;

    // Custom rendering
    optionRenderer?: OptionRenderer;
    resultRenderer?: ResultRenderer;
}

// Merged settings interface
export interface LookupToSelectSettings extends Required<Pick<LookupToSelectOptions, 'placeholder' | 'delay'>> {
    initialValue?: {
        id: string;
        text: string;
        entityLogicalName?: string;
    };
    entities?: EntityConfig[];
    data?: Select2.DataFormat[];
    getData?: GetDataFunction;
    groupByFieldName?: string;
    groupByTextFieldName?: string;
    groupByEntity?: boolean;
    minimumInputLength?: number;
    optionRenderer?: OptionRenderer;
    resultRenderer?: ResultRenderer;
}
