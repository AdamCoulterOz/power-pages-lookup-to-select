import { AttributeMetadata } from "../AttributeMetadata";
import { ExtensionData } from "../../Record/ExtensionData";
import { OptionSetMetadata } from "../../Record/OptionSet";

export interface PickList extends AttributeMetadata {

    DefaultFormValue?: number;
    ExtensionData?: ExtensionData;
    OptionSet: OptionSetMetadata;
    ChildPicklistLogicalNames?: string[];
    FormulaDefinition: string;
    ParentPicklistLogicalName: string;
    SourceTypeMask: number;
}
