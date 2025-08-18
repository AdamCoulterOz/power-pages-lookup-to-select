import { Label } from "../Label";
import { Meta } from "../Meta";

export class ManagedPropertyMeta extends Meta {
    logicalName: string;
    displayName: Label;
    managedPropertyType: ManagedPropertyType | null;
    operation: ManagedPropertyOperation | null;
    isGlobalForOperation: boolean | null;
    evaluationPriority: ManagedPropertyEvaluationPriority | null;
    isPrivate: boolean | null;
    errorCode: number | null;
    enablesEntityName: string;
    enablesAttributeName: string;
    description: Label;
    introducedVersion: string;
}

export enum ManagedPropertyType {
    Operation,
    Attribute,
    CustomEvaluator,
    Custom
}

export enum ManagedPropertyOperation {
    None = 0,
    Create = 1,
    Update = 2,
    CreateUpdate = 3,
    Delete = 4,
    UpdateDelete = 6,
    All = 7
}

export enum ManagedPropertyEvaluationPriority {
    None,
    Low,
    Normal,
    High,
    Essential
}