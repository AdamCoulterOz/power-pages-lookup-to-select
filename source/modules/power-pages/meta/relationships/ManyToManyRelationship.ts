import { Label } from "../../Label";
import { ExtensionData } from "../ExtensionData";
import { RelationshipMeta } from "../Relationship";

export interface ManyToManyRelationship extends RelationshipMeta
{
    Entity1AssociatedMenuConfiguration: AssociatedMenuConfiguration;
    Entity2AssociatedMenuConfiguration: AssociatedMenuConfiguration;
    Entity1LogicalName: string;
    Entity2LogicalName: string;
    IntersectEntityName: string;
    Entity1IntersectAttribute: string;
    Entity2IntersectAttribute: string;
    Entity1NavigationPropertyName: string;
    Entity2NavigationPropertyName: string;
}

export interface AssociatedMenuConfiguration {
    Behavior?: AssociatedMenuBehavior | null;
    Group?: AssociatedMenuGroup | null;
    Label: Label;
    Order?: number | null;
    IsCustomizable: boolean | null;
    Icon: string;
    ViewId: string;
    AvailableOffline: boolean;
    MenuId: string;
    QueryApi: string;
    ExtensionData: ExtensionData;
}

export enum AssociatedMenuBehavior
{
    UseCollectionName,
    UseLabel,
    DoNotDisplay
}

export enum AssociatedMenuGroup
{
    Details,
    Sales,
    Service,
    Marketing
}