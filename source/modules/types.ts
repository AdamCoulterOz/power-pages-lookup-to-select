/**
 * Type definitions for Power Pages Lookup to Select
 */
import * as Select2 from 'select2';
import { Data, DVEntity } from './power-pages/types';

// Entity configuration for single entity
export interface EntityConfig {
    entitySetName: string;
    idFieldName: string;
    textFieldName: string;
    tableLogicalName: string;
    displayName?: string;
}

// getData function signature
export type GetDataFunction<T extends DVEntity> = (searchTerm: string) => Promise<Data<T>[]>;

// Custom renderer functions
export type OptionRenderer = (result: Select2.DataFormat | Select2.GroupedDataFormat | Select2.LoadingData) => string | JQuery | null;
export type ResultRenderer = (selection: Select2.DataFormat | Select2.GroupedDataFormat | Select2.IdTextPair | Select2.LoadingData, container: JQuery) => string | JQuery;

// Plugin options interface
export interface LookupToSelectOptions<T extends DVEntity = DVEntity> {
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
    getData?: GetDataFunction<T>;

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
export interface LookupToSelectSettings<T extends DVEntity = DVEntity> extends Required<Pick<LookupToSelectOptions<T>, 'placeholder' | 'delay'>> {
    initialValue?: {
        id: string;
        text: string;
        entityLogicalName?: string;
    };
    entities?: EntityConfig[];
    data?: Select2.DataFormat[];
    getData?: GetDataFunction<T>;
    groupByFieldName?: string;
    groupByTextFieldName?: string;
    groupByEntity?: boolean;
    minimumInputLength?: number;
    optionRenderer?: OptionRenderer;
    resultRenderer?: ResultRenderer;
}
