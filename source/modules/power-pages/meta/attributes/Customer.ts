import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { LookupBaseMeta } from "./LookupBase";


export interface CustomerMeta extends LookupBaseMeta {
    AttributeType: AttributeType.Customer;
    AttributeTypeName: Value<'CustomerType'>;
    Targets: ['account', 'contact'];
}
