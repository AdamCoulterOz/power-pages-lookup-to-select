import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { TextMeta } from "./TextAttribute";

export interface MemoMeta extends TextMeta {
    AttributeType: AttributeType.Memo;
    AttributeTypeName: Value<'MemoType'>;
}
