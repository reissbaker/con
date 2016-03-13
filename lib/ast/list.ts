'use strict';

import { IntermediateNode } from './intermediate-node';

export class List extends IntermediateNode {
  get head() {
    return this.children[0];
  }

  get rest() {
    return this.children.slice(1);
  }

  clone(): List {
    const list = new List(this.line);
    list.addClonesOf(this.children);
    return list;
  }
}
