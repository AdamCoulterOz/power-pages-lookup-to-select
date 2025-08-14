import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";

export interface FileMeta extends AttributeMeta {
    AttributeType: AttributeType.Virtual;
    AttributeTypeName: Value<'FileType'>;
    MaxSizeInKB?: number;
}
