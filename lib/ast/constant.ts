'use strict';

import { AstNode } from './ast-node';

export enum ConstantType {
  Int32,
  Int16,
  Int8,
  Uint32,
  Uint16,
  Uint8,
  Float64,
  Float32,
  Float16,
  Float8,
  Bool,
}

export class Constant<ValueType> extends AstNode {
  private _value: ValueType;
  private _type: ConstantType;

  constructor(line: number, type: ConstantType, value: ValueType) {
    super(line);
    this._value = value;
    this._type = type;
  }

  clone(): Constant<ValueType> {
    return new Constant(this.line, this._type, this._value);
  }

  get value() {
    return this._value;
  }
  get constantType() {
    return this._type;
  }
}
