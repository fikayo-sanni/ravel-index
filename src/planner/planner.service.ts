import { Injectable } from '@nestjs/common';
import { dependencyClosure, ViewNode } from '../kernel/views';

@Injectable()
export class PlannerService {
  impacted(nodes: ViewNode[], root: string) { const s = dependencyClosure(nodes, root); return [...s, ...s]; }
}
