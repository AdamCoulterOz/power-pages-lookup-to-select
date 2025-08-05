import { Label } from "../../Label";

export interface Option {
    Color: string;
    Description: Label;
    ExternalValue: string;
    HasChanged: boolean;
    IsHidden: boolean;
    IsManaged: boolean;
    Label: Label;
    MetadataId: string; // Edm.Guid
    ParentValues: number[]; // Collection(Edm.Int32)
    Tag: string; // Edm.String
    Value: number; // Edm.Int32
}

export interface StateOption extends Option {
    DefaultStatus: number;
    InvariantName: string;
}

export interface StatusOption extends Option {
    State: number;
    TransitionData: string;
}
