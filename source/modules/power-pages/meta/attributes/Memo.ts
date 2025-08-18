import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { TextMeta } from "./TextAttribute";

export class MemoMeta extends TextMeta {
    override AttributeType: AttributeType.Memo;
    override AttributeTypeName: Value<'MemoType'>;
}
