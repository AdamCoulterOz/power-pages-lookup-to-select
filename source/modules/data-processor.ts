import * as Select2 from 'select2';
import { LookupToSelectOptions } from './types';
import { Data, DVEntity } from './power-pages/types';

type OptionWithEntity<T extends DVEntity> =
  Select2.DataFormat & {
    entityType?: string;
    entityDisplayName?: string;
    data: Data<T>;
  };

const normGuid = (g: string) => String(g).replace(/[{}]/g, "").toLowerCase();

function toOption<T extends DVEntity>(el: Data<T>): OptionWithEntity<T> {
  return {
    id: normGuid(el.id),
    text: el.name ?? "",
    entityType: (el as any).entityLogicalName,
    entityDisplayName: (el as any).entityDisplayName,
    data: el,
  };
}

export function processGroupByEntity<T extends DVEntity>(data: Data<T>[]): Select2.GroupedDataFormat[] {
  const groups = new Map<string, Select2.GroupedDataFormat>();
  for (const el of data) {
    const key = (el as any).entityDisplayName ?? (el as any).entityLogicalName ?? "Other";
    if (!groups.has(key)) groups.set(key, { text: key, children: [] });
    groups.get(key)!.children!.push(toOption(el));
  }
  return Array.from(groups.values());
}

export function processGroupByField<T extends DVEntity>(
  data: Data<T>[], groupByFieldName: string, groupByTextFieldName?: string
): Select2.GroupedDataFormat[] {
  const groups = new Map<string, Select2.GroupedDataFormat>();
  for (const el of data) {
    const opt = toOption(el);
    const groupKey  = String((el as any)[groupByFieldName] ?? "");
    const groupText = String((el as any)[groupByTextFieldName ?? groupByFieldName] ?? groupKey);
    if (!groups.has(groupKey)) groups.set(groupKey, { text: groupText, children: [] });
    groups.get(groupKey)!.children!.push(opt);
  }
  return Array.from(groups.values());
}

/**
 * Main data processing function that handles all grouping scenarios
 */
export function processResults<T extends DVEntity>(
  data: Data<T>[],
  settings: LookupToSelectOptions
): { results: (Select2.DataFormat | Select2.GroupedDataFormat)[] } {
  const isSingleEntity = (settings.entities?.length ?? 0) === 1;
  const groupByEntity = (settings.groupByEntity ?? true) && !isSingleEntity;

  if (settings.groupByFieldName) {
    return {
      results: processGroupByField(
        data,
        settings.groupByFieldName,
        settings.groupByTextFieldName
      ),
    };
  }

  if (groupByEntity) {
    return { results: processGroupByEntity(data) };
  }

  return { results: data.map(toOption) };
}
