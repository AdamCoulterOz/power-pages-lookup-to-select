import { AttributeMetadata } from "../AttributeMetadata";

export interface Boolean extends AttributeMetadata {
    DefaultValue: boolean;
    FormulaDefinition?: string;
    SourceTypeMask?: number;
}
