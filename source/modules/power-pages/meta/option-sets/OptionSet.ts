import { OptionMeta } from "../Option";
import { OptionSetBaseMeta } from "../OptionSet";
import { DataList } from "../DataList";

export class OptionSetMeta extends OptionSetBaseMeta {
    Options: DataList<OptionMeta>;
    ParentOptionSetName: string;
}
