import { AttributeMetadata } from "./metadata/AttributeMetadata";
import { DateTimeFormat } from "./metadata/attributes/DateTime";
import { Value } from "./Value";

export interface Record {
    Id:          string;
    EntityName:  string;
    Attributes:  Attribute[];
    CanRead:     boolean;
    CanWrite:    boolean;
    CanDelete:   boolean;
    CanAppend:   boolean;
    CanAppendTo: boolean;
    StateCode:   number;
    StatusCode:  number;
}

export enum Type {
    OptionSet = "Microsoft.Xrm.Sdk.OptionSetValue",
    GUID = "System.Guid",
    String = "System.String",
    Boolean = "System.Boolean",
    DateTime = "System.DateTime",
    Integer = "System.Int32"
}

export type ValueByType = {
    [Type.OptionSet]: Value<number>;
    [Type.GUID]: string;
    [Type.String]: string;
    [Type.Boolean]: boolean;
    [Type.DateTime]: string;  // ISO 8601
    [Type.Integer]: number;
};

export type Attribute = {
  Name: string;
  FormattedValue: string;
  DateTimeFormat: DateTimeFormat;
  DisplayValue: string;
  AttributeMetadata: AttributeMetadata;
} & (
  {
    [K in keyof ValueByType]: {
      Type: K;
      Value: ValueByType[K];
    }
  }[keyof ValueByType]
);
