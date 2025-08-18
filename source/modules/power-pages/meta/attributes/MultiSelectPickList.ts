import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { DataList } from "../DataList";
import { EnumMeta, OptionSetValue } from "./Enum";

export class MultiSelectPickListMeta extends EnumMeta {
    override AttributeType: AttributeType.Virtual;
    override AttributeTypeName: Value<'MultiSelectPicklistType'>;
    FormulaDefinition: string;
    SourceTypeMask?: number;
    ParentPickListLogicalName: string;
    ChildPicklistLogicalNames: string[];
}

export class OptionSetValueCollection extends DataList<OptionSetValue> { }