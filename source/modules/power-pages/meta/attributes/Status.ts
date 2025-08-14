import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { EnumMeta } from "./Enum";


export interface StatusMeta extends EnumMeta {
    AttributeType: AttributeType.Status;
    AttributeTypeName: Value<'StatusType'>;
}
