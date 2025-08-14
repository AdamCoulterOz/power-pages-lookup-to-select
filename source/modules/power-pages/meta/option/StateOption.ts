import { OptionMeta } from "../Option";


export interface StateOptionMeta extends OptionMeta {
    DefaultStatus?: number | null;
    InvariantName: string;
}
