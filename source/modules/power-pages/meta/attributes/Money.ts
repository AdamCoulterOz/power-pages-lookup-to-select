import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";
import { ImeMode } from "../ImeMode";

export interface MoneyMeta extends AttributeMeta {
    AttributeType: AttributeType.Money;
    AttributeTypeName: Value<'MoneyType'>;
    CalculationOf: string;
    FormulaDefinition: string;
    ImeMode?: ImeMode;
    IsBaseCurrency?: boolean;
    MaxValue?: number;
    MinValue?: number;
    Precision?: number;
    PrecisionSource?: number;
    SourceTypeMask?: number;
}
