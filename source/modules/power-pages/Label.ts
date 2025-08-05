import { ExtensionData } from "./metadata/ExtensionData";

export interface Label {
    LocalizedLabels: LocalizedLabel[];
    UserLocalizedLabel?: LocalizedLabel;
    ExtensionData: ExtensionData;
}

export interface LocalizedLabel {
    Label: string;
    LanguageCode: number;
    IsManaged: boolean;
    MetadataId: string;
    HasChanged?: boolean;
    ExtensionData: ExtensionData;
}
