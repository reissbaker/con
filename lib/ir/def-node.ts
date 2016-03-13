'use strict';

import { AstNode } from '../ast/ast-node';
import { ArgListNode } from './arg-list-node';

export interface DefI {
  line: number;
  defName: string;
  argList: ArgListNode;
  body: AstNode;
}

export class DefNode extends AstNode {
  private _body: AstNode;
  private _defName: string;
  private _argList: ArgListNode;

  constructor(args: DefI) {
    super(args.line);
    this._body = args.body;
    this._defName = args.defName;
    this._argList = args.argList;
  }

  get body() {
    return this._body;
  }

  get defName() {
    return this._defName;
  }

  get argList() {
    return this._argList;
  }

  clone(): DefNode {
    return null;
  }
}
