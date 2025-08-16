import { Data } from "./Data";
import { GroupEntry, Result, SingleEntry } from './Options';

export default function GroupResults(data: Data[], groupEntities: boolean = true): Result {
  return groupEntities
    ? { Results: groupBy(data, item => ({ key: item.LogicalName, value: item.DisplayName })) }
    : { Results: data.map(toOption) };
}

function groupBy(items: Data[], groupInfo: (item: Data) => { key: string, value: string }): GroupEntry[] {
  const groups = new Map<string, GroupEntry>();
  for (const item of items) {
    const { key, value } = groupInfo(item);
    const group = getOrAdd(groups, key, () => ({ Id: key, Text: value, Children: [] }));
    group.Children!.push(toOption(item));
  }
  return [...groups.values()];
}

function getOrAdd<K, V>(map: Map<K, V>, key: K, factory: () => V): V {
  let v = map.get(key);
  if (v === undefined) {
    v = factory();
    map.set(key, v);
  }
  return v;
}

function toOption(item: Data): SingleEntry {
  return {
    Id: item.Id,
    Text: item.Name
  };
}
