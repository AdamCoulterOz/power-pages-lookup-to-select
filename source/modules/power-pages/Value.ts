import { ExtensionData } from "./metadata/ExtensionData";

export interface Value<T> {
    Value: T;
    ExtensionData?: ExtensionData;
}

export interface ManagedProperty<T> extends Value<T> {
    CanBeChanged: boolean;
}
