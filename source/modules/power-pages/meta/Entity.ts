import { Label } from "../Label";
import { BooleanManagedProperty } from "../Value";
import { AttributeMeta } from "./Attribute";
import { EntityKeyMeta } from "./EntityKey";
import { DataMap as DataMap } from "./DataMap";
import { ExtensionData } from "./ExtensionData";
import { ExtensibleDataObject } from "./ExtensibleDataObject";
import { ManyToManyRelationship } from "./relationships/ManyToManyRelationship";
import { OneToManyRelationship } from "./relationships/OneToManyRelationship";
import { DataList } from "./DataList";

export class EntityMeta {
    ActivityTypeMask?: number | null;
    Attributes: AttributeMeta[];
    AutoRouteToOwnerQueue?: boolean | null;
    CanTriggerWorkflow?: boolean | null;
    Description?: Label | null;
    DisplayCollectionName?: Label | null;
    DisplayName?: Label | null;
    EntityHelpUrlEnabled?: boolean | null;
    EntityHelpUrl?: string | null;
    IsDocumentManagementEnabled?: boolean | null;
    IsOneNoteIntegrationEnabled?: boolean | null;
    IsInteractionCentricEnabled?: boolean | null;
    IsKnowledgeManagementEnabled?: boolean | null;
    IsSLAEnabled?: boolean | null;
    IsBPFEntity?: boolean | null;
    IsDocumentRecommendationsEnabled?: boolean | null;
    IsMSTeamsIntegrationEnabled?: boolean | null;
    SettingOf?: string | null;
    DataProviderId?: string | null; // Guid
    DataSourceId?: string | null;   // Guid
    AutoCreateAccessTeams?: boolean | null;
    IsActivity?: boolean | null;
    IsActivityParty?: boolean | null;
    IsAuditEnabled?: BooleanManagedProperty | null;
    IsRetrieveAuditEnabled?: boolean | null;
    IsRetrieveMultipleAuditEnabled?: boolean | null;
    IsArchivalEnabled?: boolean | null;
    IsRetentionEnabled?: boolean | null;
    ClusterMode?: EntityClusterMode | null;
    IsAvailableOffline?: boolean | null;
    IsChildEntity?: boolean | null;
    IsAIRUpdated?: boolean | null;
    IsValidForQueue?: BooleanManagedProperty | null;
    IsConnectionsEnabled?: BooleanManagedProperty | null;
    IconLargeName?: string | null;
    IconMediumName?: string | null;
    IconSmallName?: string | null;
    IconVectorName?: string | null;
    IsCustomEntity?: boolean | null;
    IsBusinessProcessEnabled?: boolean | null;
    IsCustomizable?: BooleanManagedProperty | null;
    IsRenameable?: BooleanManagedProperty | null;
    IsMappable?: BooleanManagedProperty | null;
    IsDuplicateDetectionEnabled?: BooleanManagedProperty | null;
    CanCreateAttributes?: BooleanManagedProperty | null;
    CanCreateForms?: BooleanManagedProperty | null;
    CanCreateViews?: BooleanManagedProperty | null;
    CanCreateCharts?: BooleanManagedProperty | null;
    CanBeRelatedEntityInRelationship?: BooleanManagedProperty | null;
    CanBePrimaryEntityInRelationship?: BooleanManagedProperty | null;
    CanBeInManyToMany?: BooleanManagedProperty | null;
    CanBeInCustomEntityAssociation?: BooleanManagedProperty | null;
    CanEnableSyncToExternalSearchIndex?: BooleanManagedProperty | null;
    SyncToExternalSearchIndex?: boolean | null;
    CanModifyAdditionalSettings?: BooleanManagedProperty | null;
    CanChangeHierarchicalRelationship?: BooleanManagedProperty | null;
    IsOptimisticConcurrencyEnabled?: boolean | null;
    ChangeTrackingEnabled?: boolean | null;
    CanChangeTrackingBeEnabled?: BooleanManagedProperty | null;
    IsImportable?: boolean | null;
    IsIntersect?: boolean | null;
    IsMailMergeEnabled?: BooleanManagedProperty | null;
    IsManaged?: boolean | null;
    IsEnabledForCharts?: boolean | null;
    IsEnabledForTrace?: boolean | null;
    IsValidForAdvancedFind?: boolean | null;
    IsVisibleInMobile?: BooleanManagedProperty | null;
    IsVisibleInMobileClient?: BooleanManagedProperty | null;
    IsReadOnlyInMobileClient?: BooleanManagedProperty | null;
    IsOfflineInMobileClient?: BooleanManagedProperty | null;
    DaysSinceRecordLastModified?: number | null;
    MobileOfflineFilters?: string | null;
    IsReadingPaneEnabled?: boolean | null;
    IsQuickCreateEnabled?: boolean | null;
    LogicalName?: string | null;
    ManyToManyRelationships: ManyToManyRelationship[];
    ManyToOneRelationships: OneToManyRelationship[];
    OneToManyRelationships: OneToManyRelationship[];
    ObjectTypeCode?: number | null;
    OwnershipType?: OwnershipTypes | null;
    PrimaryNameAttribute?: string | null;
    PrimaryImageAttribute?: string | null;
    PrimaryIdAttribute?: string | null;
    Privileges: SecurityPrivilegeMeta[];
    RecurrenceBaseEntityLogicalName?: string | null;
    ReportViewName?: string | null;
    SchemaName?: string | null;
    IntroducedVersion?: string | null;
    IsStateModelAware?: boolean | null;
    EnforceStateTransitions?: boolean | null;
    ExternalName?: string | null;
    EntityColor?: string | null;
    PrimaryKey: string[];
    Keys: EntityKeyMeta[];
    LogicalCollectionName?: string | null;
    ExternalCollectionName?: string | null;
    CollectionSchemaName?: string | null;
    EntitySetName?: string | null;
    IsEnabledForExternalChannels?: boolean | null;
    IsPrivate?: boolean | null;
    UsesBusinessDataLabelTable?: boolean | null;
    IsLogicalEntity?: boolean | null;
    HasNotes?: boolean | null;
    HasActivities?: boolean | null;
    HasFeedback?: boolean | null;
    IsSolutionAware?: boolean | null;
    Settings: EntitySetting[];
    CreatedOn?: Date | null;
    ModifiedOn?: Date | null;
    HasEmailAddresses?: boolean | null;
    OwnerId?: string | null; // Guid
    OwnerIdType?: number | null;
    OwningBusinessUnit?: string | null; // Guid
    TableType?: string | null;
}

export enum EntityClusterMode {
    Partitioned,
    Replicated,
    Local,
    FilteredReplicated
}

export enum OwnershipTypes {
    None = 0,
    UserOwned = 1,
    TeamOwned = 2,
    BusinessOwned = 4,
    OrganizationOwned = 8,
    BusinessParented = 0x10,
    Filtered = 0x20
}


export class SecurityPrivilegeMeta
{
    CanBeBasic: boolean;
    CanBeDeep: boolean;
    CanBeGlobal: boolean;
    CanBeLocal: boolean;
    CanBeEntityReference: boolean;
    CanBeParentEntityReference: boolean;
    CanBeRecordFilter: boolean;
    Name: string;
    PrivilegeId: string;
    PrivilegeType: PrivilegeType;
    ExtensionData: ExtensionData;
}

export enum PrivilegeType
{
    None,
    Create,
    Read,
    Write,
    Delete,
    Assign,
    Share,
    Append,
    AppendTo
}

export class EntitySetting {
    Name: string;
    Value: Entity;
    ChildSettings: EntitySetting[];
    ExtensionData: ExtensionData;

}

export class Entity {
  [AttributeName: string]: any;

  LogicalName: string;
  Id: string;
  Attributes: AttributeCollection;
  EntityState: EntityState | null;
  FormattedValues: FormattedValueCollection;
  RelatedEntities: RelatedEntityCollection;
  RowVersion: string;
  KeyAttributes: KeyAttributeCollection;
  HasLazyFileAttribute: boolean;
  LazyFileAttributeKey: string;
  LazyFileAttributeValue: Lazy<any>; // Lazy<object>
  LazyFileSizeAttributeKey: string;
  LazyFileSizeAttributeValue: number;
  ExtensionData: ExtensionData;
}

export class AttributeCollection extends DataMap<string, any> {}
export class FormattedValueCollection extends DataMap<string, string> {}
export class RelatedEntityCollection extends DataMap<Relationship, EntityCollection> {}
export class KeyAttributeCollection extends DataMap<string, any> {}

export enum EntityState
{
    Unchanged, Created, Changed
}

export class Relationship  extends ExtensibleDataObject {

    SchemaName: string;
    PrimaryEntityRole?: EntityRole;
}

export enum EntityRole {
    Referencing,
    Referenced
}

export class EntityCollection extends ExtensibleDataObject {
    [index: number]: Entity;
    Entities: DataList<Entity>;
    MoreRecords: boolean;
    PagingCookie: string;
    MinActiveRowVersion: string;
    TotalRecordCount: number;
    TotalRecordCountLimitExceeded: boolean;
    EntityName: string;
}

class Lazy<T> {
  private _factory: () => T;
  private _isValueCreated = false;
  private _value?: T;

  constructor(factory: () => T) {
    this._factory = factory;
  }

  get value(): T {
    if (!this._isValueCreated) {
      this._value = this._factory();
      this._isValueCreated = true;
    }
    return this._value!;
  }

  get isValueCreated(): boolean {
    return this._isValueCreated;
  }
}