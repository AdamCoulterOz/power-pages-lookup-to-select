import { Meta } from "../Meta";
import { Label } from "../Label";
import { Value, ManagedProperty, AttributeRequiredLevel } from "../Value";

export interface AttributeMeta extends Meta {
    AttributeOf: string;
    AttributeType: AttributeType; // SubType Discriminator 
    AttributeTypeName: Value<AttributeTypeNameValue>; // Secondary SubType Discriminator
    AutoNumberFormat: string;
    CanBeSecuredForCreate?: boolean;
    CanBeSecuredForRead?: boolean;
    CanBeSecuredForUpdate?: boolean;
    CanModifyAdditionalSettings: ManagedProperty<boolean>;
    ColumnNumber?: number;
    CreatedOn?: Date;
    DeprecatedVersion: string;
    Description: Label;
    DisplayName: Label;
    EntityLogicalName: string;
    ExternalName: string;
    InheritsFrom: string;
    IntroducedVersion: string;
    IsAuditEnabled: ManagedProperty<boolean>;
    IsCustomAttribute?: boolean;
    IsCustomizable: ManagedProperty<boolean>;
    IsDataSourceSecret?: boolean;
    IsFilterable?: boolean;
    IsGlobalFilterEnabled: ManagedProperty<boolean>;
    IsLogical?: boolean;
    IsManaged?: boolean;
    IsPrimaryId?: boolean;
    IsPrimaryName?: boolean;
    IsRenameable: ManagedProperty<boolean>;
    IsRequiredForForm?: boolean;
    IsRetrievable: boolean;
    IsSearchable?: boolean;
    IsSecured?: boolean;
    IsSortableEnabled: ManagedProperty<boolean>;
    IsValidForAdvancedFind: ManagedProperty<boolean>;
    IsValidForCreate?: boolean;
    IsValidForForm?: boolean;
    IsValidForGrid?: boolean;
    IsValidForRead?: boolean;
    IsValidForUpdate?: boolean;
    IsValidODataAttribute: boolean;
    LinkedAttributeId?: string;
    LogicalName: string;
    ModifiedOn?: Date;
    RequiredLevel: ManagedProperty<AttributeRequiredLevel>;
    SchemaName: string;
    Settings: EntitySetting[];
    SourceType?: number;
}

export interface EntitySetting {
    Name: string;
    ChildSettings?: EntitySetting[];
}

export enum AttributeType {
    Boolean = 0,
    Customer = 1, // entity
    DateTime = 2,
    Decimal = 3,
    Double = 4,
    Integer = 5,
    Lookup = 6,
    Memo = 7,
    Money = 8,
    Owner = 9, // entity
    PartyList = 10, // entity
    PickList = 11,
    State = 12, // 
    Status = 13,
    String = 14,
    UniqueIdentifier = 15,
    CalendarRules = 16,
    Virtual = 17,
    BigInt = 18,
    ManagedProperty = 19,
    EntityName = 20
}

export type AttributeTypeNameValue =
  | 'BooleanType'
  | 'CustomerType'
  | 'DateTimeType' 
  | 'DecimalType' 
  | 'DoubleType'
  | 'IntegerType' 
  | 'LookupType' 
  | 'MemoType' 
  | 'MoneyType' 
  | 'OwnerType'
  | 'PartyListType' 
  | 'PicklistType' 
  | 'StateType' 
  | 'StatusType' 
  | 'StringType'
  | 'UniqueidentifierType' 
  | 'CalendarRulesType' 
  | 'VirtualType' 
  | 'BigIntType'
  | 'ManagedPropertyType' 
  | 'EntityNameType' 
  | 'ImageType' 
  | 'MultiSelectPicklistType'
  | 'FileType' 
  | 'CustomType';
