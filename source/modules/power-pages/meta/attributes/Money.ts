import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";
import { ExtensibleDataObject } from "../ExtensibleDataObject";
import { ImeMode } from "../ImeMode";

export class MoneyMeta extends AttributeMeta {
    override AttributeType: AttributeType.Money;
    override AttributeTypeName: Value<'MoneyType'>;
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

export class Money extends ExtensibleDataObject {
    Value: number;
}