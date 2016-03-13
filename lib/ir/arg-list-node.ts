'use strict';

import { AstNode } from '../ast/ast-node';
import { Reference } from '../ast/reference';

export interface ArgListI {
  line: number;
  args: Reference[];
}

export class ArgListNode extends AstNode {
  private _args: Reference[];

  constructor(args: ArgListI) {
    super(args.line);
    this._args = args.args;
  }

  get args() {
    return this._args;
  }

  clone(): ArgListNode {
    return new ArgListNode({
      line: this.line,
      args: this._args,
    });
  }
}
