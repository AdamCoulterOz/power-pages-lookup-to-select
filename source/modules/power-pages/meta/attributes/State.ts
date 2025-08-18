import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { EnumMeta } from "./Enum";


export class StateMeta extends EnumMeta {
    override AttributeType: AttributeType.State;
    override AttributeTypeName: Value<'StateType'>;
}
