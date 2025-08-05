import { Memo } from "./Memo";

export interface String extends Memo {
    DatabaseLength: number;
    FormulaDefinition: string;
    SourceTypeMask: number;
    YomiOf?: string;
}
