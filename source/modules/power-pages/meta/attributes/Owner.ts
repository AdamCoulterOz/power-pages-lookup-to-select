import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { LookupBaseMeta } from "./LookupBase";


export class OwnerMeta extends LookupBaseMeta {
    override AttributeType: AttributeType.Owner;
    override AttributeTypeName: Value<'OwnerType'>;
    override Targets: ['systemuser', 'team'];
}
