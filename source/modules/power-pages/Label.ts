import { LocalizedLabelMeta } from "./meta/LocalizedLabel";
import { ExtensionData } from "./meta/ExtensionData";

export class Label {
    LocalizedLabels: LocalizedLabelMeta[];
    UserLocalizedLabel: LocalizedLabelMeta | null;
    ExtensionData: ExtensionData;
}


