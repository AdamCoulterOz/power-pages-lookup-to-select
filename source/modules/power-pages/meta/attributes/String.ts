import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { TextMeta } from "./TextAttribute";

export class StringMeta extends TextMeta {
    override AttributeType: AttributeType.String;
    override AttributeTypeName: Value<'StringType'>;
    DatabaseLength?: number;
    FormulaDefinition: string;
    SourceTypeMask?: number;
    YomiOf: string;
}
