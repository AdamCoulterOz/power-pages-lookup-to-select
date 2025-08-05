import { AttributeMetadata } from "../AttributeMetadata";

export interface Image extends AttributeMetadata {
    CanStoreFullImage: boolean;
    IsPrimaryImage: boolean;
    MaxHeight: number;
    MaxSizeInKB: number;
    MaxWidth: number;
}
