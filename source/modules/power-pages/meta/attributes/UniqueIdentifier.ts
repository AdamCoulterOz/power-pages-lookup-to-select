import { Value } from "../../Value";
import { AttributeMeta, AttributeType } from "../Attribute";

export class UniqueIdentifierMeta extends AttributeMeta { 
    override AttributeType: AttributeType.UniqueIdentifier;
    override AttributeTypeName: Value<'UniqueidentifierType'>;
}
