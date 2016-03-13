'use strict';

import { IntermediateNode } from './intermediate-node';

export abstract class AstNode {
  private _line: number;
  parent: IntermediateNode;

  constructor(line: number) {
    this._line = line;
  }

  get line() {
    return this._line;
  }

  abstract clone(): AstNode;
}
