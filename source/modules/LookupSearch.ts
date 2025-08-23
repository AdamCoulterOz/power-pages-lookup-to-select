import GroupResults from './GroupResults';
import { Config, EntityConfig } from './Config';
import { DropdownAdapter } from './adapters/Dropdown'
import { Data } from "./Data";
import PowerPagesClient from './PowerPagesClient';
import L2SError from './L2SError';

export default class LookupSearch {
    private readonly adapter: DropdownAdapter;
    private readonly fieldId: string;
    private readonly options: Config;
    private initialised: boolean = false;
    private entities: Map<string, EntityConfig> = new Map();
    private results: Map<string, Data> = new Map();
    private deleteHandler?: () => void;
    private originalLookup: HTMLElement | null = null;

    constructor(adapter: DropdownAdapter, fieldId: string, options?: Config) {
        this.adapter = adapter;
        this.fieldId = fieldId;
        this.options = options ?? new Config();
    }

    public async Apply(): Promise<void> {
        if (this.initialised)
            this.reset();

        try {
            await this.setup();
        } catch (error) {
            this.reset();
            const msg = error instanceof Error ? error.message : String(error);
            throw new L2SError(`Setup failed: ${msg}`, error as Error | undefined);
        }
        this.initialised = true;
    }

    private reset() {
        this.deleteHandler?.();
        this.adapter.Destroy();
        this.entities.clear();
        this.results.clear();
        if (this.originalLookup)
            this.originalLookup.hidden = false;
        this.originalLookup = null;
        this.initialised = false;
    }

    private async setup() {

        const defaultLookup = document.getElementById(this.fieldId) as HTMLInputElement;
        if (!defaultLookup) throw new L2SError(`Element with id ${this.fieldId} not found`);

        const customSelectId = `${this.fieldId}_L2S`;
        if (document.getElementById(customSelectId))
            throw new L2SError("Element already has a custom select");

        const entities = await PowerPagesClient.GetFieldTargets(this.fieldId);
        if (!entities || entities.length === 0)
            throw new L2SError(`No entities found for field id ${this.fieldId}`);
        entities.forEach(entity => this.entities.set(entity.LogicalName, entity));

        this.originalLookup = defaultLookup.parentElement;
        if (!this.originalLookup)
            throw new Error("lookupToSelect error: Element must have a parent element");

        const fetchAndCacheResults = async (term: string): Promise<Data[]> => {
            const results = await PowerPagesClient.Search(entities)(term);
            for (const item of results) {
                this.results.set(item.Id, item);
            }
            return results;
        };

        this.adapter.Enhance(customSelectId, this.originalLookup, this.options,
            fetchAndCacheResults, (data) => GroupResults(data, this.options.GroupByEntity), false);
        this.deleteHandler = this.adapter.OnChange((value) => {
            if (!value)
                return this.setDefaultLookupValues(defaultLookup, '', '');
            const entity = this.results.get(value.Id)!.LogicalName;
            this.setDefaultLookupValues(defaultLookup, value.Id, value.Text, entity);
        });
        this.originalLookup.hidden = true;
    }

    private setDefaultLookupValues(defaultLookup: HTMLInputElement, value: string, text: string, logicalName?: string): void {
        const baseId = defaultLookup.id;

        defaultLookup.value = value;

        const defaultLookupName = document.getElementById(`${baseId}_name`);
        if (!defaultLookupName)
            throw new L2SError(`Element with id ${baseId}_name not found`);
        (defaultLookupName as HTMLInputElement).value = text;

        if (logicalName) {
            const defaultLookupEntityName = document.getElementById(`${baseId}_entityname`);
            if (!defaultLookupEntityName)
                throw new L2SError(`Element with id ${baseId}_entityname not found`);
            (defaultLookupEntityName as HTMLInputElement).value = logicalName;
        }

        const event = new Event("change", { bubbles: true });
        defaultLookup.dispatchEvent(event);
    }
}
