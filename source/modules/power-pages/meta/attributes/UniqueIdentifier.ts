import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";

export interface UniqueIdentifierMeta extends AttributeMeta { 
    AttributeType: AttributeType.UniqueIdentifier;
    AttributeTypeName: Value<'UniqueidentifierType'>;
}
