import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";
import { ImeMode } from "../ImeMode";

export class DoubleMeta extends AttributeMeta {
    override AttributeType: AttributeType.Double;
    override AttributeTypeName: Value<'DoubleType'>;
    FormulaDefinition: string;
    ImeMode?: ImeMode;
    MaxValue?: number;
    MinValue?: number;
    Precision?: number;
    SourceTypeMask?: number;
}
