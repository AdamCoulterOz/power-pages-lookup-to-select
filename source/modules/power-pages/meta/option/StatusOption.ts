import { OptionMeta } from "../Option";


export interface StatusOptionMeta extends OptionMeta {
    State?: number | null;
    TransitionData: string;
}
