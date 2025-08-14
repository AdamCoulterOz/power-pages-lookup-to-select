import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";

export interface ImageMeta extends AttributeMeta {
    AttributeType: AttributeType.Virtual;
    AttributeTypeName: Value<'ImageType'>;
    CanStoreFullImage?: boolean;
    IsPrimaryImage?: boolean;
    MaxHeight?: number;
    MaxSizeInKB?: number;
    MaxWidth?: number;
}
