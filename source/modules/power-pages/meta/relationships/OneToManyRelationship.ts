import { RelationshipMeta } from "../Relationship";
import { AssociatedMenuConfiguration } from "./ManyToManyRelationship";


export class OneToManyRelationship extends RelationshipMeta {
    AssociatedMenuConfiguration: AssociatedMenuConfiguration;
    CascadeConfiguration: CascadeConfiguration;
    ReferencedAttribute: string;
    ReferencedEntity: string;
    ReferencingAttribute: string;
    ReferencingEntity: string;
    IsHierarchical?: boolean | null;
    EntityKey: string;
    RelationshipAttributes: Array<RelationshipAttribute>;
    IsRelationshipAttributeDenormalized?: boolean | null;
    ReferencedEntityNavigationPropertyName: string;
    ReferencingEntityNavigationPropertyName: string;
    RelationshipBehavior?: number | null;
    IsDenormalizedLookup?: boolean | null;
    DenormalizedAttributeName: string;
}

export enum CascadeConfiguration
{
    Assign,
    Delete,
    Archive,
    Merge,
    Reparent,
    Share,
    Unshare,
    RollupView
}

export class RelationshipAttribute {
    ReferencingAttributeName: string;
    ReferencedAttributeName: string;
}