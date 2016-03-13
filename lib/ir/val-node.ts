'use strict';

import { AstNode } from '../ast/ast-node';

export interface ValI {
  line: number;
  refname: string;
  body: AstNode;
}

export class ValNode extends AstNode {
  private _refname: string;
  private _body: AstNode;

  constructor(args: ValI) {
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

  clone(): ValNode {
    return new ValNode(this);
  }
}
