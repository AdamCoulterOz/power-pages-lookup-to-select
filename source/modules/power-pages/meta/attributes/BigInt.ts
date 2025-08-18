import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";

export class BigIntMeta extends AttributeMeta {
    override AttributeType: AttributeType.BigInt;
    override AttributeTypeName: Value<'BigIntType'>;
    MaxValue?: number;
    MinValue?: number;
}
