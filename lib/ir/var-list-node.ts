'use strict';

import { AstNode } from '../ast/ast-node';
import { VarTupleNode } from './var-tuple-node';

export interface VarListI {
  line: number;
  tuples: VarTupleNode[];
}

export class VarListNode extends AstNode {
  private _tuples: VarTupleNode[];

  constructor(args: VarListI) {
    super(args.line);
    this._tuples = args.tuples;
  }

  get tuples() {
    return this._tuples;
  }

  clone(): VarListNode {
    return null;
  }
}
