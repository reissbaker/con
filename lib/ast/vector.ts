'use strict';

import { IntermediateNode } from './intermediate-node';

export class Vector extends IntermediateNode {
  clone(): Vector {
    const vector = new Vector(this.line);
    vector.addClonesOf(this.children);
    return vector;
  }
}
