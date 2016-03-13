'use strict';

export enum PrimitiveType {
  Null,
  Int32,
  Float64,
  Bool,
  Byte,
};

export class StructureType {
  private _fields: { [key: string]: StructureType|PrimitiveType } = {};

  constructor(fields: { [key: string]: StructureType|PrimitiveType }) {
    for(let prop in fields) {
      if(fields.hasOwnProperty(prop)) {
        this._fields[prop] = fields[prop];
      }
    }
  }

  get fields() {
    return this._fields;
  }
}

export type Type = PrimitiveType|StructureType;
export type FieldMap = { [key: string]: Type };

export class FnType extends StructureType {
  private _args: Type[];
  private _returnType: Type;

  constructor(args: Type[], returnType: Type) {
    super({
      length: PrimitiveType.Int32,
    });

    this._args = args;
    this._returnType = returnType;
  }

  get args() {
    return this._args;
  }

  get returnType() {
    return this._returnType;
  }
}

export class TaggedUnionType extends StructureType {
  private _types: Type[];

  constructor(types: Type[]) {
    // TODO: support transparent type intersection; e.g. if all types in the union have a "length"
    // field that is a Uint32, you should be able to call .length on the unioned type without having
    // to use a pattern match to split the types out.
    super({});
    this._types = types;
  }

  get types() {
    return this._types;
  }
}

