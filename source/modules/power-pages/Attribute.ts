import { Type, Transform, TypeOptions } from "class-transformer";
import { AttributeMeta } from "./meta/Attribute";
import { Money, MoneyMeta } from "./meta/attributes/Money";
import { MultiSelectPickListMeta, OptionSetValueCollection } from "./meta/attributes/MultiSelectPickList";
import { EntityReference } from "./meta/attributes/LookupBase";
import { OptionSetValue } from "./meta/attributes/Enum";
import { BigIntMeta } from "./meta/attributes/BigInt";
import { BooleanMeta } from "./meta/attributes/Boolean";
import { CustomerMeta } from "./meta/attributes/Customer";
import { DateTimeMeta } from "./meta/attributes/DateTime";
import { DecimalMeta } from "./meta/attributes/Decimal";
import { DoubleMeta } from "./meta/attributes/Double";
import { EntityNameMeta } from "./meta/attributes/EntityName";
import { FileMeta } from "./meta/attributes/File";
import { ImageMeta } from "./meta/attributes/Image";
import { IntegerMeta } from "./meta/attributes/Integer";
import { LookupMeta } from "./meta/attributes/Lookup";
import { MemoMeta } from "./meta/attributes/Memo";
import { OwnerMeta } from "./meta/attributes/Owner";
import { PickListMeta } from "./meta/attributes/PickList";
import { StateMeta } from "./meta/attributes/State";
import { StatusMeta } from "./meta/attributes/Status";
import { StringMeta } from "./meta/attributes/String";
import { UniqueIdentifierMeta } from "./meta/attributes/UniqueIdentifier";
import { ManagedPropertyMeta } from "./meta/ManagedProperty";

export const AttributeMetaDiscriminator = {
  discriminator: {
    property: "AttributeTypeNameValue",
    subTypes: [
      { value: BooleanMeta, name: "BooleanType" },
      { value: CustomerMeta, name: "CustomerType" },
      { value: DateTimeMeta, name: "DateTimeType" },
      { value: DecimalMeta, name: "DecimalType" },
      { value: DoubleMeta, name: "DoubleType" },
      { value: IntegerMeta, name: "IntegerType" },
      { value: LookupMeta, name: "LookupType" },
      { value: MemoMeta, name: "MemoType" },
      { value: MoneyMeta, name: "MoneyType" },
      { value: OwnerMeta, name: "OwnerType" },
      { value: PickListMeta, name: "PicklistType" },
      { value: StateMeta, name: "StateType" },
      { value: StatusMeta, name: "StatusType" },
      { value: StringMeta, name: "StringType" },
      { value: UniqueIdentifierMeta, name: "UniqueidentifierType" },
      { value: BigIntMeta, name: "BigIntType" },
      { value: ManagedPropertyMeta, name: "ManagedPropertyType" },
      { value: EntityNameMeta, name: "EntityNameType" },
      { value: ImageMeta, name: "ImageType" },
      { value: MultiSelectPickListMeta, name: "MultiSelectPicklistType" },
      { value: FileMeta, name: "FileType" },
    ],
  },
};

export function flattenMetaDiscriminator<T extends Record<string, any>>(
  o: T
): T {
  if (o && o.AttributeTypeName && typeof o.AttributeTypeName === "object") {
    (o as any).AttributeTypeNameValue = o.AttributeTypeName.Value;
  }
  return o;
}

export class Attribute {
  Name: string;
  FormattedValue?: string;
  DisplayValue?: string;

  @Transform(({ value }) => flattenMetaDiscriminator(value), {
    toClassOnly: true,
  })
  @Type(() => AttributeMeta, AttributeMetaDiscriminator)
  AttributeMetadata?: AttributeMeta;
}

export class StringAttribute extends Attribute {
  Value: string;
}

export class Int32Attribute extends Attribute {
  Value: number;
}

export class OptionSetAttribute extends Attribute {
  @Type(() => OptionSetValue)
  Value: OptionSetValue;
}

export class OptionSetCollectionAttribute extends Attribute {
  @Type(() => OptionSetValueCollection)
  Value: OptionSetValueCollection;
}

export class EntityReferenceAttribute extends Attribute {
  @Type(() => EntityReference)
  Value: EntityReference;
}

export class MoneyAttribute extends Attribute {
  @Type(() => Money)
  Value: Money;
}

// raw value would be "/Date(1755106200000)/"
export class DateTimeAttribute extends Attribute {
  @Transform(
    ({ value }) => {
      if (typeof value === "string") {
        const match = /\/Date\((\d+)\)\//.exec(value);
        if (match) {
          return new Date(Number(match[1]));
        }
      }
      return value ? new Date(value) : null;
    },
    { toClassOnly: true }
  )
  Value!: Date | null;
}

export class GuidAttributeType extends Attribute {
  Value: string;
}

export class BooleanAttribute extends Attribute {
  Value: boolean;
}

export class DoubleAttribute extends Attribute {
  Value: number;
}

export class ByteArrayAttribute extends Attribute {
  @Transform(
    ({ value }) => (Array.isArray(value) ? new Uint8Array(value) : value),
    { toClassOnly: true }
  )
  Value: Uint8Array;
}

export class DecimalAttribute extends Attribute {
  Value: number;
}

