import * as s2 from 'select2';
import * as c from '../Config';
import * as ic from '../Options';
import { DropdownAdapter, DropdownHandle, DropdownValue } from './Dropdown';

export class Select2DropdownAdapter implements DropdownAdapter {

    public Enhance<T>(
        host: HTMLElement,
        config: c.Config,
        dataRetriever: (term: string) => Promise<T[]>,
        dataProcessor: (data: T[]) => ic.Result
    ): DropdownHandle {
        const $element = jQuery(host);
        const options = Select2DropdownAdapter.MapOptions(config, dataRetriever, dataProcessor);
        $element.select2(options);

        // listeners
        const subscribers = new Set<(v: DropdownValue | null) => void>();

        const toDropdownValue = (item: s2.OptionData): DropdownValue => ({
            Id: item.id,
            Text: item.text
        });

        const handle: DropdownHandle = {
            OnChange(cb) { subscribers.add(cb); return () => subscribers.delete(cb); },
            GetValue() {
                const arr: s2.OptionData[] = $element.select2('data') || [];
                return arr.length > 0 ? toDropdownValue(arr[0]) : null;
            },
            GetValues() {
                const arr: s2.OptionData[] = $element.select2('data') || [];
                return arr.map(toDropdownValue);
            },
            SetValue(value) {
                $element.val(value ? value.Id : []).trigger('change');
            },
            SetValues(values) {
                $element.val(values.map(v => v.Id)).trigger('change');
            },
            Destroy() {
                $element.off('.select2adapter');
                subscribers.clear();
                $element.select2('destroy');
            }
        };

        const notify = () => { subscribers.forEach(cb => cb(handle.GetValue())); };

        // select2 event wiring
        const onDomChange = () => notify();
        $element.on('change.select2adapter', onDomChange);
        $element.on('select2:select.select2adapter', onDomChange);
        $element.on('select2:unselect.select2adapter', onDomChange);

        notify();
        return handle;
    }

    private static MapOptions<T = any>(
        config: c.Config,
        dataRetriever: (searchTerm: string) => Promise<T[]>,
        dataProcessor: (data: T[]) => ic.Result
    ): s2.Options {
        return {
            width: config.WidthPercent ? `${config.WidthPercent}%` : '100%',
            placeholder: config.Placeholder,
            allowClear: !!config.AllowClear,
            minimumInputLength: config.MinimumInputLength ?? undefined,
            templateResult: Select2DropdownAdapter.OptionRenderer(config.OptionRenderer),
            templateSelection: Select2DropdownAdapter.SelectionRenderer(config.ResultRenderer),
            ajax: {
                delay: config.Delay,
                transport: function (params: any, success: (data: any[]) => void, failure: (err: any) => void) {
                    const term = String(params?.data?.term ?? '');
                    const p = Promise.resolve().then(() => dataRetriever(term || ''));
                    p.then(success).catch(failure);
                    // Return an object compatible with jqXHR abort API
                    return { abort: () => { /* no-op for promise-based */ } } as any;
                },
                processResults: (_data: any[], _params: s2.QueryOptions) =>
                    Select2DropdownAdapter.ProcessedResult(dataProcessor(_data as T[]))
            }
        };
    }

    private static ProcessedResult(result: ic.Result): s2.ProcessedResult {
        return {
            results: result.Results.map(item => {
                if ('children' in item) {
                    const groupedDataItem = item as unknown as ic.GroupEntry;
                    return {
                        text: groupedDataItem.Text,
                        children: groupedDataItem.Children?.map(child => mapDataFormat(child))
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
                        disabled: item.Disabled
                    } as s2.DataFormat;
                }
            }),
            pagination: Select2DropdownAdapter.Pagination(result.Pagination)
        };
    }

    private static Pagination(pagination: { More: boolean; } | undefined): { more: boolean; } | undefined {
        if (!pagination) return undefined;
        return { more: pagination.More };
    }

    private static SelectionRenderer(resultRenderer: c.ResultRenderer | undefined)
        : ((selection: s2.IdTextPair | s2.LoadingData | s2.DataFormat | s2.GroupedDataFormat, container: JQuery) => string | JQuery) | undefined {
        const selectionTpl: c.ResultRenderer = resultRenderer || ((item: any) => (item && item.text) ? item.text : "");

        const templateSelection = (selection: s2.IdTextPair | s2.LoadingData | any, container: JQuery): string | JQuery => {
            if (selection && (selection as s2.LoadingData).loading) {
                const val = selectionTpl({ loading: true, text: selection.text } as c.LoadingItem, container[0] as HTMLElement);
                if (val instanceof HTMLElement) return jQuery(val);
                return val;
            }
            const node = {
                id: String(selection?.id ?? ""),
                text: selection?.text ?? "",
                disabled: !!selection?.disabled,
                selected: !!selection?.selected,
                data: selection?.data ?? undefined
            };
            const val = selectionTpl(node, container[0] as HTMLElement);
            if (val instanceof HTMLElement) return jQuery(val);
            return val;
        };
        return templateSelection;
    }

    private static OptionRenderer(optionRenderer: c.OptionRenderer | undefined)
        : ((result: s2.LoadingData | s2.DataFormat | s2.GroupedDataFormat) => string | JQuery | null) | undefined {
        const optionTpl: c.OptionRenderer = optionRenderer || ((item: any) => (item && item.text) ? item.text : "");

        // Wrapper converts Select2 payloads to our public UI types before rendering
        const templateResult = (result: s2.LoadingData | any): string | JQuery | null => {
            // Loading case
            if (result && (result as s2.LoadingData).loading) {
                const val = optionTpl({ loading: true, text: result.text } as c.LoadingItem);
                if (val instanceof HTMLElement) return jQuery(val);
                return val;
            }
            // Group or option
            if (Array.isArray(result?.children)) {
                // Group node
                const group = {
                    text: result.text, children: (result.children || []).map((c: any) => ({
                        id: String(c.id),
                        text: c.text,
                        disabled: !!c.disabled,
                        selected: !!c.selected,
                        data: c.data ?? undefined
                    }))
                };
                const val = optionTpl(group);
                if (val instanceof HTMLElement) return jQuery(val);
                return val;
            }
            // Option node
            const node = {
                id: String(result?.id ?? ""),
                text: result?.text ?? "",
                disabled: !!result?.disabled,
                selected: !!result?.selected,
                data: result?.data ?? undefined
            };
            const val = optionTpl(node);
            if (val instanceof HTMLElement) return jQuery(val);
            return val;
        };
        return templateResult;
    }
}