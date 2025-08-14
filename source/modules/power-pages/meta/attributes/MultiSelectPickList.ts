import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { DataList } from "../DataList";
import { EnumMeta, OptionSetValue } from "./Enum";

export interface MultiSelectPickListMeta extends EnumMeta {
    AttributeType: AttributeType.Virtual;
    AttributeTypeName: Value<'MultiSelectPicklistType'>;
    FormulaDefinition: string;
    SourceTypeMask?: number;
    ParentPickListLogicalName: string;
    ChildPicklistLogicalNames: string[];
}

export interface OptionSetValueCollection extends DataList<OptionSetValue> { }