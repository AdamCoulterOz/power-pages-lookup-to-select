import { AttributeMetadata } from "../AttributeMetadata";

export interface Integer extends AttributeMetadata {
    Format: IntegerFormat;
    FormulaDefinition: string;
    MaxValue: number;
    MinValue: number;
    SourceTypeMask: number;
}

export enum IntegerFormat {
    None = 0,
    Duration = 1,
    TimeZone = 2,
    Language = 3,
    Locale = 4
}
