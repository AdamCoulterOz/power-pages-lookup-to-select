import { AttributeMetadata } from "../AttributeMetadata";

export interface Lookup extends AttributeMetadata {
    Format: LookupFormat;
    Targets: string[];
}

export enum LookupFormat {
    None = 0,
    Connection = 1,
    Regarding = 2,
    Text = 3
}
