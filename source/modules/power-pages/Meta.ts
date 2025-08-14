import { ExtensionData } from "./meta/ExtensionData";

export interface Meta {
    HasChanged?: boolean;
    MetadataId?: string;
    ExtensionData: ExtensionData
}
