import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";

export interface ManagedPropertyMeta extends AttributeMeta {
    AttributeType: AttributeType.ManagedProperty;
    AttributeTypeName: Value<'ManagedPropertyType'>;
    ManagedPropertyLogicalName: string;
    ParentAttributeName: string;
    ParentComponentType?: number;
    ValueAttributeTypeCode: AttributeType;
}
