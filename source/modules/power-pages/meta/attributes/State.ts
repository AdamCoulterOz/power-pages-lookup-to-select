import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { EnumMeta } from "./Enum";


export interface StateMeta extends EnumMeta {
    AttributeType: AttributeType.State;
    AttributeTypeName: Value<'StateType'>;
}
