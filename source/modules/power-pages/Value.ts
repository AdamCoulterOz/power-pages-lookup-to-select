import { ExtensionData } from "./meta/ExtensionData";

export interface Value<T> {
    Value: T;
    ExtensionData?: ExtensionData;
}

export interface ManagedProperty<T> extends Value<T> {
    CanBeChanged: boolean;
    ManagedPropertyLogicalName: string;
}

export interface BooleanManagedProperty extends ManagedProperty<boolean> { }

export interface AttributeRequiredLevelManagedProperty extends ManagedProperty<AttributeRequiredLevel> {
    IsCanBeChangedPropertyModified: boolean;
    IsValueModified: boolean;
}

export enum AttributeRequiredLevel {
    None = 0,
    SystemRequired = 1,
    ApplicationRequired = 2,
    Recommended = 3
}