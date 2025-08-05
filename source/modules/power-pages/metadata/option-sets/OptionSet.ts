import { Option } from "./Option";
import { MetadataBase } from "../MetadataBase";
import { Label } from "../../Label";
import { ManagedProperty } from "../../Value";

export interface OptionSetBase extends MetadataBase {
    Description: Label;
    DisplayName: Label;
    ExternalTypeName: string;
    IntroducedVersion: string;
    IsCustomizable: ManagedProperty<boolean>;
    IsCustomOptionSet: boolean;
    IsGlobal: boolean;
    IsManaged: boolean;
    Name: string;
    OptionSetType: OptionSetType;
}

export enum OptionSetType {
    PickList = 0,
    State = 1,
    Status = 2,
    Boolean = 3
}

export interface OptionSet extends OptionSetBase {
    Options: Option[];
    ParentOptionSetName: string;
}

export interface BooleanOptionSet extends OptionSetBase {
    DisplayName: Label;
    FalseOption: Option;
    TrueOption: Option;
}
