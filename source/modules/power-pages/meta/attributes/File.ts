import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";

export class FileMeta extends AttributeMeta {
    override AttributeType: AttributeType.Virtual;
    override AttributeTypeName: Value<'FileType'>;
    MaxSizeInKB?: number;
}
