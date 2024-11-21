import { Injectable } from '@nestjs/common';
import { depthRefreshOrder, ViewNode } from '../kernel/views';

@Injectable()
export class RefreshService {
  plan(nodes: ViewNode[]) { if (nodes.length === 0) throw new Error('empty'); return depthRefreshOrder(nodes); }
}
