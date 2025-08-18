import { Label } from "../Label";
import { Meta } from "../Meta";

export class OptionMeta extends Meta {
    Color: string | null;
    Description: Label;
    ExternalValue: string | null;
    IsHidden: boolean;
    IsManaged: boolean | null;
    Label: Label;
    ParentValues: number[] | null;
    Tag: string | null;
    Value?: number | null;
}

