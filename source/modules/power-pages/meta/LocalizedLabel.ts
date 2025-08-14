import { Meta } from "../Meta";


export interface LocalizedLabelMeta extends Meta {
    Label: string;
    LanguageCode: number;
    IsManaged?: boolean;
}
