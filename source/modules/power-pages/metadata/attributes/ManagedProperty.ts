import { AttributeMetadata, AttributeType } from "../AttributeMetadata";

export interface ManagedProperty extends AttributeMetadata {
    ManagedPropertyLogicalName: string;
    ParentAttributeName: string;
    ParentComponentType: number;
    ValueAttributeTypeCode: AttributeType;
}
