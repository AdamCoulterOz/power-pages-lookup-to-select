import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";

export interface LookupBaseMeta extends AttributeMeta {
  AttributeType: AttributeType.Lookup | AttributeType.Customer | AttributeType.Owner;
    AttributeTypeName: Value<'LookupType' | 'CustomerType' | 'OwnerType'>;
    Format?: LookupFormat;
    Targets: string[];
}

export enum LookupFormat {
    None = 0,
    Connection = 1,
    Regarding = 2,
    Text = 3
}
