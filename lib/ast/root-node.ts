'use strict';

import { IntermediateNode } from './intermediate-node';

export class RootNode extends IntermediateNode {
  constructor() {
    super(0);
  }
  clone(): RootNode {
    const root = new RootNode();
    root.addClonesOf(this.children);
    return root;
  }
}
