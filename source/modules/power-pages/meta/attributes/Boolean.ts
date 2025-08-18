import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";
import { BooleanOptionSetMeta } from "../option-sets/BooleanOptionSet";


export class BooleanMeta extends AttributeMeta
{
    override AttributeType: AttributeType.Boolean;
    override AttributeTypeName: Value<'BooleanType'>;
    DefaultValue?: boolean;
    FormulaDefinition: string;
    SourceTypeMask?: number;
    OptionSet: BooleanOptionSetMeta;
}
