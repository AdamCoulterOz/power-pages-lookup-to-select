import { AttributeMeta } from "./meta/Attribute";
import { DateTimeFormat } from "./meta/attributes/DateTime";
import { Value } from "./Value";

export interface LookupData {
  MoreRecords: boolean;
  Records: EntityRecord[];
  ItemCount: number;
  PageCount: number;
  PageNumber: number;
  PageSize: number;
  NextPagePagingCookie?: string;
  ViewConfiguration: null;
  CompleteViewLayout: null;
  CreateActionMetadata: CreateActionMetadata;
  DisabledItemActionLinks: any[];
}

export interface CreateActionMetadata {
  Disabled: boolean;
  DisabledMessage: null;
}

export interface EntityRecord {
  Id: string;
  EntityName: string;
  Attributes: Attribute[];
  CanRead: boolean;
  CanWrite: boolean;
  CanDelete: boolean;
  CanAppend: boolean;
  CanAppendTo: boolean;
  StateCode: number;
  StatusCode: number;
}

export enum Type {
  BigInt = "System.Int64",
  Boolean = "System.Boolean",
  Customer = "Microsoft.Xrm.Sdk.EntityReference", //??
  DateTime = "System.DateTime",
  Decimal = "System.Decimal",
  Double = "System.Double",
  EntityName = "Microsoft.Xrm.Sdk.EntityReference", //??
  File = "Microsoft.Xrm.Sdk.File", //??
  Image = "Microsoft.Xrm.Sdk.Image", //??
  Integer = "System.Int32",
  Lookup = "Microsoft.Xrm.Sdk.EntityReference", //??
  ManagedProperty = "Microsoft.Xrm.Sdk.ManagedProperty", //??
  Memo = "Microsoft.Xrm.Sdk.Memo", //??
  Money = "Microsoft.Xrm.Sdk.Money", //??
  MultiSelectPicklist = "Microsoft.Xrm.Sdk.MultiSelectPicklist", //??
  Owner = "Microsoft.Xrm.Sdk.EntityReference", //??
  PickList = "Microsoft.Xrm.Sdk.PickList", //??
  State = "Microsoft.Xrm.Sdk.OptionSetValue",
  Status = "Microsoft.Xrm.Sdk.OptionSetValue",
  String = "System.String",
  OptionSet = "Microsoft.Xrm.Sdk.OptionSetValue",
  BooleanOptionSet = "Microsoft.Xrm.Sdk.BooleanOptionSet",
  UniqueIdentifier = "System.Guid",
}

export type ValueByType = {
  [Type.String]: string;
  [Type.Integer]: number;
  [Type.Decimal]: number;
  [Type.Double]: number;
  [Type.Boolean]: boolean;
  [Type.DateTime]: string;
  [Type.UniqueIdentifier]: string;
  [Type.BigInt]: number;

  [Type.Customer]: Value<string>;
  [Type.File]: Value<File>;
  // [Type.Image]: Value<>;
  // [Type.Lookup]: Value<Lookup>;
  // [Type.ManagedProperty]: Value<ManagedProperty>;
  [Type.Memo]: Value<string>;
  [Type.Money]: Value<number>;
  // [Type.MultiSelectPicklist]: Value<MultiSelectPicklist>;
  // [Type.Owner]: Value<Owner>;
  // [Type.PickList]: Value<PickList>;
  // [Type.State]: Value<string>;
  // [Type.Status]: Value<string>;
  [Type.OptionSet]: Value<number>;
};

export interface Attribute<T extends Type, K extends keyof ValueByType = keyof ValueByType> {
  Name: string;
  Type: K;
  Value: T;
  FormattedValue?: string;
  DisplayValue?: string;
  AttributeMetadata?: AttributeMeta;
}


