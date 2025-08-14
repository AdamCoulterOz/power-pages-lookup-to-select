import { OptionMeta } from "../Option";
import { OptionSetBaseMeta } from "../OptionSet";


export interface BooleanOptionSetMeta extends OptionSetBaseMeta {
    FalseOption: OptionMeta;
    TrueOption: OptionMeta;
}
