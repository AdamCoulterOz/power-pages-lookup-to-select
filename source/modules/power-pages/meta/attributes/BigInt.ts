import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";

export interface BigIntMeta extends AttributeMeta {
    AttributeType: AttributeType.BigInt;
    AttributeTypeName: Value<'BigIntType'>;
    MaxValue?: number;
    MinValue?: number;
}
