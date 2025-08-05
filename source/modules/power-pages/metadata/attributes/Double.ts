import { AttributeMetadata } from "../AttributeMetadata";
import { ImeMode } from "../ImeMode";

export interface Double extends AttributeMetadata {
    FormulaDefinition: string;
    ImeMode: ImeMode;
    MaxValue: number;
    MinValue: number;
    Precision: number;
    SourceTypeMask: number;
}
