import { Meta } from "../Meta";
import { BooleanManagedProperty } from "../Value";

export class RelationshipMeta extends Meta
{
    IsCustomRelationship?: boolean;
    IsCustomizable: BooleanManagedProperty;
    IsValidForAdvancedFind?: boolean;
    SchemaName: string;
    SecurityTypes?: SecurityTypes;
    IsManaged?: boolean;
    RelationshipType: RelationshipType;
    IntroducedVersion: string;
}

export enum SecurityTypes{
    None = 0,
    Append = 1,
    ParentChild = 2,
    Pointer = 4,
    Inheritance = 8
}

export enum RelationshipType {
    OneToManyRelationship = 0,
    ManyToManyRelationship = 1
}