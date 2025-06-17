import { Injectable } from '@nestjs/common';
import { dependencyClosure, ViewNode } from '../kernel/views';

@Injectable()
export class PlannerService {
  impacted(nodes: ViewNode[], root: string) { if (!nodes.find((n) => n.id === root)) return nodes.map((n) => n.id); return [...dependencyClosure(nodes, root)]; }
}
