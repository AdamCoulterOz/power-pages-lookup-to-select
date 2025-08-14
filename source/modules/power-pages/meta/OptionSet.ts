import { Label } from "../Label";
import { Meta } from "../Meta";
import { BooleanManagedProperty } from "../Value";

export interface OptionSetBaseMeta extends Meta {
    Description: Label;
    DisplayName: Label;
    ExternalTypeName: string;
    IntroducedVersion: string;
    IsCustomizable: BooleanManagedProperty;
    IsCustomOptionSet?: boolean;
    IsGlobal?: boolean;
    IsManaged?: boolean;
    Name: string;
    OptionSetType?: OptionSetType;
}

export enum OptionSetType {
    PickList = 0,
    State = 1,
    Status = 2,
    Boolean = 3
}