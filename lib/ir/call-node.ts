'use strict';

import { AstNode } from '../ast/ast-node';

export interface CallI {
  line: number;
  refname: string;
  args: AstNode[];
}

export class CallNode extends AstNode {
  private _refname: string;
  private _args: AstNode[];

  constructor(args: CallI) {
    super(args.line);
    this._refname = args.refname;
    this._args = args.args;
  }

  get refname() {
    return this._refname;
  }

  get args() {
    return this._args;
  }

  clone(): CallNode {
    return null;
  }
}
