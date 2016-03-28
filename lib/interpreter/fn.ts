'use strict';

import { FnType } from './types';
import { Value } from './value';
import { ScopeTree } from './scope';

export type FnBody = (scope: ScopeTree, args: Value[]) => Value;

export class Fn extends Value {
  private _body: FnBody;

  constructor(typeObject: FnType, fn: FnBody) {
    super(typeObject);
    this._body = fn;
  }

  run(scope: ScopeTree, args: Value[]): Value {
    return this._body(scope, args);
  }
}

