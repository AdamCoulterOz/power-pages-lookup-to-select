import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";
import { ImeMode } from "../ImeMode";

export class DecimalMeta extends AttributeMeta {
    override AttributeType: AttributeType.Decimal;
    override AttributeTypeName: Value<'DecimalType'>;
    FormulaDefinition: string;
    ImeMode?: ImeMode;
    MaxValue?: number;
    MinValue?: number;
    Precision?: number;
    SourceTypeMask?: number;
}
