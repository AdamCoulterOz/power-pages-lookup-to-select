import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";
import { DataMap } from "../DataMap";
import { ExtensionData } from "../ExtensionData";

export class LookupBaseMeta extends AttributeMeta {
  override AttributeType: AttributeType.Lookup | AttributeType.Customer | AttributeType.Owner;
    override AttributeTypeName: Value<'LookupType' | 'CustomerType' | 'OwnerType'>;
    Format?: LookupFormat;
    Targets: string[];
}

export enum LookupFormat {
    None = 0,
    Connection = 1,
    Regarding = 2,
    Text = 3
}

export class EntityReference {
    Id: string;
    LogicalName: string;
    Name: string;
    KeyAttributes: KeyAttributeCollection;
    RowVersion: string;
    ExtensionData: ExtensionData;
}
export class KeyAttributeCollection extends DataMap<string, any> {
    // Additional properties or methods can be defined here
}
