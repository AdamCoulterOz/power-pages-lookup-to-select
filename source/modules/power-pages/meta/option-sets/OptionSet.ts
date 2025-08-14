import { OptionMeta } from "../Option";
import { OptionSetBaseMeta } from "../OptionSet";
import { DataList } from "../DataList";

export interface OptionSetMeta extends OptionSetBaseMeta {
    Options: DataList<OptionMeta>;
    ParentOptionSetName: string;
}
