'use strict';

import { AstNode } from '../ast/ast-node';
import { VarListNode } from './var-list-node';

export interface LetI {
  line: number;
  varListNode: VarListNode;
  body: AstNode;
}

export class LetNode extends AstNode {
  private _varListNode: VarListNode;
  private _body: AstNode;

  constructor(args: LetI) {
    super(args.line);
    this._varListNode = args.varListNode;
    this._body = args.body;
  }

  get varListNode() {
    return this._varListNode;
  }

  get body() {
    return this._body;
  }

  clone(): LetNode {
    return null;
  }
}
