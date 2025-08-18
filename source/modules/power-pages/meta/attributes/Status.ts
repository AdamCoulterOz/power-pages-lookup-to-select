import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { EnumMeta } from "./Enum";


export class StatusMeta extends EnumMeta {
    override AttributeType: AttributeType.Status;
    override AttributeTypeName: Value<'StatusType'>;
}
