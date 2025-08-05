import { AttributeMetadata } from "../AttributeMetadata";
import { Value } from "../../Value";
import { ImeMode } from "../ImeMode";

export interface Memo extends AttributeMetadata {
    Format: StringFormat;
    FormatName: Value<string>;
    ImeMode: ImeMode;
    IsLocalizable: boolean;
    MaxLength: number;
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