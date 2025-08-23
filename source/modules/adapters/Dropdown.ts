import { Config } from "../Config";
import { Result } from "../Options";

export interface DropdownAdapter {
  Enhance<T>(
    selectId: string,
    adjacentLocation: HTMLElement,
    config: Config,
    dataRetriever: (term: string) => Promise<T[]>,
    dataProcessor: (data: T[]) => Result,
    multiple?: boolean
  ): void;
  
  OnChange(cb: (value: DropdownValue | null) => void): () => void;
  GetValue(): DropdownValue | null;
  GetValues(): DropdownValue[];
  SetValue(value: DropdownValue | null): void;
  SetValues(values: DropdownValue[]): void;
  Destroy(): void;
}

export interface DropdownValue {
  Id: string;
  Text: string;
}