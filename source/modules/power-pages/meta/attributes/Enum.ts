import { Value } from "../../Value";
import { AttributeMeta } from "../Attribute";
import { ExtensibleDataObject } from "../ExtensibleDataObject";
import { OptionSetMeta } from "../option-sets/OptionSet";

// abstract
export class EnumMeta extends AttributeMeta {
    override AttributeTypeName: Value<'MultiSelectPicklistType'| 'PicklistType' | 'StateType' | 'StatusType' | 'EntityNameType'>;
    DefaultFormValue?: number;
    OptionSet: OptionSetMeta;
}

// abstract
export class EnumSingleMeta extends EnumMeta {
    override AttributeTypeName: Value<'PicklistType' | 'StateType' | 'StatusType' | 'EntityNameType'>;
}

export class OptionSetValue extends ExtensibleDataObject {
    Value: number;
}