export class Config {
    public GroupByField?: string;
    public GroupByEntity?: boolean;

    // UX options
    public Placeholder: string = "Search by typing...";
    public AllowClear: boolean = true;
    public MinimumInputLength: number = 3;
    public Delay: number = 250;
    public Multiple: boolean | null = null;

    public WidthPercent?: number | null;

    // Custom renderers, used to format the display of options and results
    public OptionRenderer?: OptionRenderer;
    public ResultRenderer?: ResultRenderer;
}

export interface EntityConfig {
    LogicalName: string;
    DisplayName: string;
    SetName: string;
    IdField: string;
    TextField: string;
}

export interface UINode {
    text: string;
}

export interface UISingle extends UINode {}

export interface UI extends UISingle {
    id: string;
    disabled?: boolean;
    selected?: boolean;
    data?: Record<string, unknown>;
}

export interface LoadingItem extends UISingle {
    loading: true;
}

export interface UIGroup extends UINode {
    children: UI[];
}

export type OptionRenderer = (result: UINode) => string | HTMLElement | null;
export type ResultRenderer = (selection: UISingle, container: HTMLElement) => string | HTMLElement;
