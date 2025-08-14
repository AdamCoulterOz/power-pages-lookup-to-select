import { Value } from "../../Value";
import { AttributeMeta } from "../Attribute";
import { ImeMode } from "../ImeMode";

// abstract
export interface TextMeta extends AttributeMeta {
    AttributeTypeName: Value<'MemoType'|'StringType'>;
    Format?: StringFormat;
    FormatName: Value<string>;
    ImeMode?: ImeMode;
    IsLocalizable?: boolean;
    MaxLength?: number;
}

export enum StringFormat {
    Email = 0,
    Text = 1,
    TextArea = 2,
    Url = 3,
    TickerSymbol = 4,
    PhoneticGuide = 5,
    VersionNumber = 6,
    Phone = 7,
    Json = 8,
    RichText = 9
}