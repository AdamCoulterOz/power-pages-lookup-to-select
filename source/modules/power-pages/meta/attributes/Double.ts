import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";
import { ImeMode } from "../ImeMode";

export interface DoubleMeta extends AttributeMeta {
    AttributeType: AttributeType.Double;
    AttributeTypeName: Value<'DoubleType'>;
    FormulaDefinition: string;
    ImeMode?: ImeMode;
    MaxValue?: number;
    MinValue?: number;
    Precision?: number;
    SourceTypeMask?: number;
}
