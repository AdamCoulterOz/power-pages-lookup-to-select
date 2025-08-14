import { Value } from "../../Value";
import { AttributeMeta } from "../Attribute";
import { IExtensibleDataObject } from "../IExtensibleDataObject";
import { OptionSetMeta } from "../option-sets/OptionSet";

// abstract
export interface EnumMeta extends AttributeMeta {
    AttributeTypeName: Value<'MultiSelectPicklistType'| 'PicklistType' | 'StateType' | 'StatusType' | 'EntityNameType'>;
    DefaultFormValue?: number;
    OptionSet: OptionSetMeta;
}

// abstract
export interface EnumSingleMeta extends EnumMeta {
    AttributeTypeName: Value<'PicklistType' | 'StateType' | 'StatusType' | 'EntityNameType'>;
}

export interface OptionSetValue extends IExtensibleDataObject {
    Value: number;
}