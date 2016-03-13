'use strict';

import { AstNode } from './ast-node';

export class Reference extends AstNode {
  private _refname: string;

  constructor(line: number, refname: string) {
    super(line);
    this._refname = refname;
  }

  get refname() {
    return this._refname;
  }

  clone(): Reference {
    return new Reference(this.line, this._refname);
  }
}
