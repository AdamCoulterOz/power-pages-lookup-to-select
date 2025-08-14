import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { LookupBaseMeta } from "./LookupBase";


export interface OwnerMeta extends LookupBaseMeta {
    AttributeType: AttributeType.Owner;
    AttributeTypeName: Value<'OwnerType'>;
    Targets: ['systemuser', 'team'];
}
