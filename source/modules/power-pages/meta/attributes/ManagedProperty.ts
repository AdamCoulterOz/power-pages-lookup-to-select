import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";

export class ManagedPropertyMeta extends AttributeMeta {
    override AttributeType: AttributeType.ManagedProperty;
    override AttributeTypeName: Value<'ManagedPropertyType'>;
    ManagedPropertyLogicalName: string;
    ParentAttributeName: string;
    ParentComponentType?: number;
    ValueAttributeTypeCode: AttributeType;
}
