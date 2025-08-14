import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { EnumMeta } from "./Enum";

export interface EntityNameMeta extends EnumMeta {
    AttributeType: AttributeType.EntityName;
    AttributeTypeName: Value<'EntityNameType'>;
    IsEntityReferenceStored: boolean;
}
