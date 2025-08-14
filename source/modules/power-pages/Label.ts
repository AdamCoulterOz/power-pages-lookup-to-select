import { LocalizedLabelMeta } from "./meta/LocalizedLabel";
import { ExtensionData } from "./meta/ExtensionData";

export interface Label {
    LocalizedLabels: LocalizedLabelMeta[];
    UserLocalizedLabel: LocalizedLabelMeta | null;
    ExtensionData: ExtensionData;
}


