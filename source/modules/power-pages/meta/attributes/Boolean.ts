import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";
import { BooleanOptionSetMeta } from "../option-sets/BooleanOptionSet";

export interface BooleanMeta extends AttributeMeta
{
    AttributeType: AttributeType.Boolean;
    AttributeTypeName: Value<'BooleanType'>;
    DefaultValue?: boolean;
    FormulaDefinition: string;
    SourceTypeMask?: number;
    OptionSet: BooleanOptionSetMeta;
}
