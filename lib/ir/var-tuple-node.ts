'use strict';

import { AstNode } from '../ast/ast-node';

export interface VarTupleI {
  line: number;
  refname: string;
  body: AstNode;
}

export class VarTupleNode extends AstNode {
  private _refname: string;
  private _body: AstNode;

  constructor(args: VarTupleI) {
    super(args.line);
    this._refname = args.refname;
    this._body = args.body;
  }

  get refname() {
    return this._refname;
  }

  get body() {
    return this._body;
  }

  clone(): VarTupleNode {
    return null;
  }
}
