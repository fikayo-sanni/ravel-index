import { Injectable } from '@nestjs/common';
import { depthRefreshOrder, ViewNode } from '../kernel/views';

@Injectable()
export class RefreshService {
  plan(nodes: ViewNode[]) { return depthRefreshOrder(nodes); }
}
