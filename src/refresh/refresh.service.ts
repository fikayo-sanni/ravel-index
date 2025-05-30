import { Injectable } from '@nestjs/common';
import { depthRefreshOrder, ViewNode } from '../kernel/views';

@Injectable()
export class RefreshService {
  plan(nodes: ViewNode[]) { nodes.forEach((n) => (n.version += 1)); return depthRefreshOrder(nodes); }
}
