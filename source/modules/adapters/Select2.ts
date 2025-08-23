import type * as s2 from "select2"; // Types only; runtime plugin is expected to be provided by the host page
import * as c from "../Config";
import * as ic from "../Options";
import { DropdownAdapter, DropdownValue } from "./Dropdown";

export class Select2DropdownAdapter implements DropdownAdapter {
  private searchDropdown: HTMLSelectElement | null = null;
  private s2: JQuery | null = null;
  private subscribers = new Set<(v: DropdownValue | null) => void>();
  private jQuery: JQueryStatic = window.$!;

  public Enhance<T>(
    selectId: string,
    adjacentLocation: HTMLElement,
    config: c.Config,
    dataRetriever: (term: string) => Promise<T[]>,
    dataProcessor: (data: T[]) => ic.Result,
    multiple?: boolean
  ) {
    // Create new dropdown element
    this.searchDropdown = document.createElement("select");
    this.searchDropdown.classList.add("form-select");
    this.searchDropdown.id = selectId;
    if (multiple) this.searchDropdown.multiple = true;
    adjacentLocation.insertAdjacentElement("afterend", this.searchDropdown);

    if (!this.jQuery) throw new Error("jQuery is not available on window.");
    this.s2 = this.jQuery(this.searchDropdown);
    const options = this.MapOptions(
      config,
      dataRetriever,
      dataProcessor
    );

    this.s2!.select2(options);

    const notify = () => {
      this.subscribers.forEach((listener) => listener(this.GetValue()));
    };

    // select2 event wiring
    const onDomChange = () => notify();
    this.s2!.on("change.select2adapter", onDomChange);
    this.s2!.on("select2:select.select2adapter", onDomChange);
    this.s2!.on("select2:unselect.select2adapter", onDomChange);

    notify();
    return this as any; // Returning instance; caller expects DropdownHandle shape
  }

  public static toDropdownValue(item: s2.OptionData): DropdownValue {
    return {
      Id: item.id,
      Text: item.text,
    };
  }

  public OnChange(cb: (value: DropdownValue | null) => void): () => void {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  public GetValue(): DropdownValue | null {
    if (!this.s2) return null;
    const arr: s2.OptionData[] = this.s2.select2("data") || [];
    return arr.length > 0
      ? Select2DropdownAdapter.toDropdownValue(arr[0])
      : null;
  }

  public GetValues(): DropdownValue[] {
    if (!this.s2) return [];
    const arr: s2.OptionData[] = this.s2.select2("data") || [];
    return arr.map(Select2DropdownAdapter.toDropdownValue);
  }

  public SetValue(value: DropdownValue | null): void {
    if (!this.s2) return;
    this.s2.val(value ? value.Id : []).trigger("change");
  }

  public SetValues(values: DropdownValue[]): void {
    if (!this.s2) return;
    this.s2.val(values.map((v) => v.Id)).trigger("change");
  }

  public Destroy(): void {
    if (this.s2) {
      this.s2.off(".select2adapter");
      this.s2.select2("destroy");
      // Remove created element if we own it
      this.searchDropdown?.remove();
    }
    this.subscribers.clear();
    this.s2 = null;
    this.searchDropdown = null;
  }

  private MapOptions<T = any>(
    config: c.Config,
    dataRetriever: (searchTerm: string) => Promise<T[]>,
    dataProcessor: (data: T[]) => ic.Result
  ): s2.Options {
    return {
      width: config.WidthPercent ? `${config.WidthPercent}%` : "100%",
      placeholder: config.Placeholder,
      allowClear: !!config.AllowClear,
      minimumInputLength: config.MinimumInputLength ?? undefined,
      templateResult: this.OptionRenderer(
        config.OptionRenderer
      ),
      templateSelection: this.SelectionRenderer(
        config.ResultRenderer
      ),
      ajax: {
        delay: config.Delay,
        transport: (
          params: any,
          success: (data: any[]) => void,
          failure: (err: any) => void
        ) => {
          const term = String(params?.data?.term ?? "");
          Promise.resolve()
            .then(() => dataRetriever(term))
            .then(success)
            .catch(failure);
          // Return an abort stub to satisfy Select2 expectations (jqXHR-like)
          return {
            abort: () => {
              /* promise cannot be cancelled */
            },
          } as any;
        },
        processResults: (raw: any[], _params: s2.QueryOptions) =>
          this.ProcessedResult(dataProcessor(raw as T[])),
      },
    };
  }

  private ProcessedResult(result: ic.Result): s2.ProcessedResult {
    return {
      results: result.Results.map((item) => {
        if ("Children" in item) {
          const groupedDataItem = item as unknown as ic.GroupEntry;
          return {
            text: groupedDataItem.Text,
            children: groupedDataItem.Children?.map((child) =>
              mapDataFormat(child)
            ),
          } as s2.GroupedDataFormat;
        } else {
          const dataItem = item as ic.SingleEntry;
          return mapDataFormat(dataItem);
        }

        function mapDataFormat(item: ic.SingleEntry) {
          return {
            id: item.Id,
            text: item.Text,
            selected: item.Selected,
            disabled: item.Disabled,
          } as s2.DataFormat;
        }
      }),
      pagination: this.Pagination(result.Pagination),
    };
  }

  private Pagination(
    pagination: { More: boolean } | undefined
  ): { more: boolean } | undefined {
    if (!pagination) return undefined;
    return { more: pagination.More };
  }

  private SelectionRenderer(
    resultRenderer: c.ResultRenderer | undefined
  ):
    | ((
        selection:
          | s2.DataFormat
          | s2.GroupedDataFormat
          | s2.IdTextPair
          | s2.LoadingData,
        container: JQuery
      ) => string | JQuery)
    | undefined {
    const selectionTpl: c.ResultRenderer =
      resultRenderer || ((item: any) => (item && item.text ? item.text : ""));

    const templateSelection = (
      selection: s2.IdTextPair | s2.LoadingData | any,
      container: JQuery
    ): string | JQuery => {
      const hostEl =
        container && (container as any)[0]
          ? ((container as any)[0] as HTMLElement)
          : undefined;
      if (selection && (selection as s2.LoadingData).loading) {
        const val = selectionTpl(
          { loading: true, text: selection.text } as c.LoadingItem,
          hostEl as any
        );
        if (val instanceof HTMLElement) return this.jQuery(val);
        return val;
      }
      const node = {
        id: String(selection?.id ?? ""),
        text: selection?.text ?? "",
        disabled: !!selection?.disabled,
        selected: !!selection?.selected,
        data: selection?.data ?? undefined,
      };
      const val = selectionTpl(node, hostEl as any); // guard when container is undefined
      if (val instanceof HTMLElement) return this.jQuery(val);
      return val;
    };
    return templateSelection;
  }

  private OptionRenderer(
    optionRenderer: c.OptionRenderer | undefined
  ):
    | ((
        result: s2.LoadingData | s2.DataFormat | s2.GroupedDataFormat
      ) => string | JQuery | null)
    | undefined {
    const optionTpl: c.OptionRenderer =
      optionRenderer || ((item: any) => (item && item.text ? item.text : ""));

    // Wrapper converts Select2 payloads to our public UI types before rendering
    const templateResult = (
      result: s2.LoadingData | any
    ): string | JQuery | null => {
      // Loading case
      if (result && (result as s2.LoadingData).loading) {
        const val = optionTpl({
          loading: true,
          text: result.text,
        } as c.LoadingItem);
        if (val instanceof HTMLElement) return this.jQuery(val);
        return val;
      }
      // Group or option
      if (Array.isArray(result?.children)) {
        // Group node
        const group = {
          text: result.text,
          children: (result.children || []).map((c: any) => ({
            id: String(c.id),
            text: c.text,
            disabled: !!c.disabled,
            selected: !!c.selected,
            data: c.data ?? undefined,
          })),
        };
        const val = optionTpl(group);
        if (val instanceof HTMLElement) return this.jQuery(val);
        return val;
      }
      // Option node
      const node = {
        id: String(result?.id ?? ""),
        text: result?.text ?? "",
        disabled: !!result?.disabled,
        selected: !!result?.selected,
        data: result?.data ?? undefined,
      };
      const val = optionTpl(node);
      if (val instanceof HTMLElement) return this.jQuery(val);
      return val;
    };
    return templateResult;
  }
}
