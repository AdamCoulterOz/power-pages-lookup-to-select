import { Label } from "../Label";
import { Meta } from "../Meta";
import { BooleanManagedProperty } from "../Value";
import { DataMap } from "./DataMap";
import { ExtensionData } from "./ExtensionData";

export interface EntityKeyMeta extends Meta {
    
    DisplayName: Label;
    LogicalName: string;
    SchemaName: string;
    EntityLogicalName: string;
    KeyAttributes: string[];
    IsCustomizable: BooleanManagedProperty;
    IsManaged?: boolean;
    IntroducedVersion: string;
    EntityKeyIndexStatus: EntityKeyIndexStatus;
    AsyncJob: EntityReference;
    IsSynchronous?: boolean;
    IsExportKey?: boolean;
    IsSecondaryKey?: boolean;
}

export enum EntityKeyIndexStatus{
    Pending,
    InProgress,
    Active,
    Failed
}

export interface EntityReference {
    Id: string;
    LogicalName: string;
    Name: string;
    KeyAttributes: KeyAttributeCollection;
    RowVersion: string;
    ExtensionData: ExtensionData;
}

export interface KeyAttributeCollection extends DataMap<string, any> {
    // Additional properties or methods can be defined here
}
