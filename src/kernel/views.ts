export type ViewId = string;

export interface ViewNode {
  id: ViewId;
  dependsOn: ViewId[];
  version: number;
}

export function dependencyClosure(nodes: ViewNode[], changed: ViewId): Set<ViewId> {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const out = new Set<ViewId>();
  const stack = [changed];
  while (stack.length) {
    const cur = stack.pop()!;
    if (out.has(cur)) continue;
    out.add(cur);
    for (const n of nodes) {
      if (n.dependsOn.includes(changed) && !out.has(n.id)) stack.push(n.id);
    }
  }
  return out;
}

export function refreshOrder(nodes: ViewNode[]): ViewId[] {
  const indeg = new Map<ViewId, number>();
  for (const n of nodes) indeg.set(n.id, 0);
  for (const n of nodes) for (const d of n.dependsOn) indeg.set(n.id, (indeg.get(n.id) ?? 0) + 1);
  const q = [...nodes].filter((n) => (indeg.get(n.id) ?? 0) === 0).map((n) => n.id);
  q.sort();
  const out: ViewId[] = [];
  const children = new Map<ViewId, ViewId[]>();
  for (const n of nodes) for (const d of n.dependsOn) {
    const arr = children.get(d) ?? [];
    arr.push(n.id);
    children.set(d, arr);
  }
  while (q.length) {
    const id = q.shift()!;
    out.push(id);
    for (const c of (children.get(id) ?? []).sort()) {
      indeg.set(c, (indeg.get(c) ?? 0) - 1);
      if ((indeg.get(c) ?? 0) === 0) q.push(c);
    }
    q.sort();
  }
  if (out.length !== nodes.length) throw new Error('cycle');
  return out;
}

export function depthRefreshOrder(nodes: ViewNode[]): ViewId[] {
  const depth = new Map<ViewId, number>();
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const calc = (id: ViewId): number => {
    if (depth.has(id)) return depth.get(id)!;
    const n = byId.get(id);
    if (!n || n.dependsOn.length === 0) {
      depth.set(id, 0);
      return 0;
    }
    const d = Math.max(...n.dependsOn.map(calc)) + 1;
    depth.set(id, d);
    return d;
  };
  for (const n of nodes) calc(n.id);
  return [...nodes]
    .sort((a, b) => {
      const da = depth.get(a.id) ?? 0;
      const db = depth.get(b.id) ?? 0;
      if (da !== db) return da - db;
      return a.id.localeCompare(b.id);
    })
    .map((n) => n.id);
}
