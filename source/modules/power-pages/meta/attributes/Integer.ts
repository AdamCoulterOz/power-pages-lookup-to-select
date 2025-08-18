import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";

export class IntegerMeta extends AttributeMeta {
    override AttributeType: AttributeType.Integer;
    override AttributeTypeName: Value<'IntegerType'>;
    Format?: IntegerFormat;
    FormulaDefinition: string;
    MaxValue?: number;
    MinValue?: number;
    SourceTypeMask?: number;
}

export enum IntegerFormat {
    None = 0,
    Duration = 1,
    TimeZone = 2,
    Language = 3,
    Locale = 4
}
