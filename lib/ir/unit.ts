'use strict';

import { AstNode } from '../ast/ast-node';

export class Unit extends AstNode {
  clone(): Unit {
    return new Unit(this.line);
  }
}
