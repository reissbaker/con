'use strict';

import { Type } from './types';

export class Value {
  private _typeObject: Type;

  constructor(typeObject: Type) {
    this._typeObject = typeObject;
  }

  get typeObject() {
    return this._typeObject;
  }
}
