import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { EnumMeta } from "./Enum";

export interface PickListMeta extends EnumMeta {

    AttributeType: AttributeType.PickList;
    AttributeTypeName: Value<'PicklistType'>;
    FormulaDefinition: string;
    SourceTypeMask?: number;
    ParentPicklistLogicalName: string;
    ChildPicklistLogicalNames: string[];
}

