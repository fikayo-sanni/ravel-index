import { Injectable } from '@nestjs/common';
import { refreshOrder, ViewNode } from '../kernel/views';

@Injectable()
export class RefreshService {
  plan(nodes: ViewNode[]) { return refreshOrder(nodes); }
}
