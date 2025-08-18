import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";

export class ImageMeta extends AttributeMeta {
    override AttributeType: AttributeType.Virtual;
    override AttributeTypeName: Value<'ImageType'>;
    CanStoreFullImage?: boolean;
    IsPrimaryImage?: boolean;
    MaxHeight?: number;
    MaxSizeInKB?: number;
    MaxWidth?: number;
}
