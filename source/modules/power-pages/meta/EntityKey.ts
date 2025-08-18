import { Label } from "../Label";
import { Meta } from "../Meta";
import { BooleanManagedProperty } from "../Value";
import { EntityReference } from "./attributes/LookupBase";

export class EntityKeyMeta extends Meta {
    
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



