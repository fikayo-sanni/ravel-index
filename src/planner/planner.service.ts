import { Injectable } from '@nestjs/common';
import { dependencyClosure, ViewNode } from '../kernel/views';

@Injectable()
export class PlannerService {
  impacted(nodes: ViewNode[], root: string) { return [...dependencyClosure(nodes, root)]; }
}
