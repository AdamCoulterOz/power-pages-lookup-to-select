import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";
import { ImeMode } from "../ImeMode";

export interface DecimalMeta extends AttributeMeta {
    AttributeType: AttributeType.Decimal;
    AttributeTypeName: Value<'DecimalType'>;
    FormulaDefinition: string;
    ImeMode?: ImeMode;
    MaxValue?: number;
    MinValue?: number;
    Precision?: number;
    SourceTypeMask?: number;
}
