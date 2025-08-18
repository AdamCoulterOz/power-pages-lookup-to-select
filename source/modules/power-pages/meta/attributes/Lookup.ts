import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { LookupBaseMeta } from "./LookupBase";


export class LookupMeta extends LookupBaseMeta {
    override AttributeType: AttributeType.Lookup;
    override AttributeTypeName: Value<'LookupType'>;
}
