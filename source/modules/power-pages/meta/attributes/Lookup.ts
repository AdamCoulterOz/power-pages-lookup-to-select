import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { LookupBaseMeta } from "./LookupBase";


export interface LookupMeta extends LookupBaseMeta {
    AttributeType: AttributeType.Lookup;
    AttributeTypeName: Value<'LookupType'>;
}
