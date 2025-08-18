import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { LookupBaseMeta } from "./LookupBase";

export class CustomerMeta extends LookupBaseMeta {
    override AttributeType: AttributeType.Customer;
    override AttributeTypeName: Value<'CustomerType'>;
    override Targets: ['account', 'contact'];
}
