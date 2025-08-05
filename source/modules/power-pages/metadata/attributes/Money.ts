import { AttributeMetadata } from "../AttributeMetadata";
import { ImeMode } from "../ImeMode";

export interface Money extends AttributeMetadata {
    CalculationOf: string;
    FormulaDefinition: string;
    ImeMode: ImeMode;
    IsBaseCurrency: boolean;
    MaxValue: number;
    MinValue: number;
    Precision: number;
    PrecisionSource: number;
    SourceTypeMask: number;
}
