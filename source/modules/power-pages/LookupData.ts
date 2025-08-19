import { Transform, Type, TypeOptions } from "class-transformer";
import {
  Attribute,
  BooleanAttribute,
  ByteArrayAttribute,
  DateTimeAttribute,
  DecimalAttribute,
  DoubleAttribute,
  EntityReferenceAttribute,
  GuidAttributeType,
  Int32Attribute,
  MoneyAttribute,
  OptionSetAttribute,
  OptionSetCollectionAttribute,
  StringAttribute,
} from "./Attribute";
import { CompleteViewLayout } from "./ViewLayout";

export class CreateActionMetadata {
  Disabled: boolean;
  DisabledMessage: null;
}

export class LookupData {
  MoreRecords: boolean;
  @Type(() => EntityRecord)
  Records: EntityRecord[];
  ItemCount: number;
  PageCount: number;
  PageNumber: number;
  PageSize: number;
  NextPagePagingCookie?: string | null;
  ViewConfiguration: null;
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  @Type(() => CompleteViewLayout)
  CompleteViewLayout: CompleteViewLayout;
  @Type(() => CreateActionMetadata)
  CreateActionMetadata: CreateActionMetadata;
}

export const AttributeDiscriminator: TypeOptions = {
  discriminator: {
    property: "Type",
    subTypes: [
      { name: "System.String", value: StringAttribute },
      { name: "System.Int32", value: Int32Attribute },
      { name: "System.Decimal", value: DecimalAttribute },
      { name: "System.Double", value: DoubleAttribute },
      { name: "System.Boolean", value: BooleanAttribute },
      { name: "System.Guid", value: GuidAttributeType },
      { name: "System.Byte[]", value: ByteArrayAttribute },
      { name: "System.DateTime", value: DateTimeAttribute },
      {
        name: "Microsoft.Xrm.Sdk.EntityReference",
        value: EntityReferenceAttribute,
      },
      { name: "Microsoft.Xrm.Sdk.OptionSetValue", value: OptionSetAttribute },
      {
        name: "Microsoft.Xrm.Sdk.OptionSetValueCollection",
        value: OptionSetCollectionAttribute,
      },
      { name: "Microsoft.Xrm.Sdk.Money", value: MoneyAttribute },
    ],
  },
};

export class EntityRecord {
  Id: string;
  EntityName: string;

  @Type(() => Attribute, AttributeDiscriminator)
  Attributes: Attribute[];
  CanRead: boolean;
  CanWrite: boolean;
  CanDelete: boolean;
  CanAppend: boolean;
  CanAppendTo: boolean;
  StateCode: number;
  StatusCode: number;
}
