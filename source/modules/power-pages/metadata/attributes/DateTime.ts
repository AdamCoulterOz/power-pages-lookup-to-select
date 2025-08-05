import { AttributeMetadata } from "../AttributeMetadata";
import { ManagedProperty, Value } from "../../Value";
import { ImeMode } from "../ImeMode";

export interface DateTime extends AttributeMetadata {
    CanChangeDateTimeBehavior: ManagedProperty<boolean>;
    DateTimeBehavior: Value<DateTimeBehavior>;
    Format: DateTimeFormat;
    FormulaDefinition: string;
    ImeMode: ImeMode;
    MaxSupportedValue: Date;
    MinSupportedValue: Date;

    // A bitmask value that describes the sources of data used in a calculated attribute or whether the data sources are invalid.
    SourceTypeMask: number;
}

export enum DateTimeFormat {
    DateOnly = 0,
    DateAndTime = 1
}

export enum DateTimeBehavior {
    UserLocal = "UserLocal",
    DateOnly = "DateOnly",
    TimeZoneIndependent = "TimeZoneIndependent"
}
