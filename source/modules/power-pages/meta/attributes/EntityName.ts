import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { EnumMeta } from "./Enum";

export class EntityNameMeta extends EnumMeta {
    override AttributeType: AttributeType.EntityName;
    override AttributeTypeName: Value<'EntityNameType'>;
    IsEntityReferenceStored: boolean;
}
