'use strict';

import { Type } from './types';
import { Value } from './value';
import { ScopeTree } from './scope';

export class Primitive extends Value {
  private _val: any;

  constructor(typeObject: Type, val: any) {
    super(typeObject);
    this._val = val;
  }

  get value(): any {
    return this._val;
  }
}

