import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { TextMeta } from "./TextAttribute";

export interface StringMeta extends TextMeta {
    AttributeType: AttributeType.String;
    AttributeTypeName: Value<'StringType'>;
    DatabaseLength?: number;
    FormulaDefinition: string;
    SourceTypeMask?: number;
    YomiOf: string;
}
