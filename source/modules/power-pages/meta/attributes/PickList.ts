import { Value } from "../../Value";
import { AttributeType } from "../Attribute";
import { EnumMeta } from "./Enum";

export class PickListMeta extends EnumMeta {

    override AttributeType: AttributeType.PickList;
    override AttributeTypeName: Value<'PicklistType'>;
    FormulaDefinition: string;
    SourceTypeMask?: number;
    ParentPicklistLogicalName: string;
    ChildPicklistLogicalNames: string[];
}

