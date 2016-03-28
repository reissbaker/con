'use strict';

export type Type = NominalType
                 | UnionType
                 | IntersectionType
                 | LambdaDeltaType
                 | FnType;


export type FieldMap = { [key: string]: Type };

export class NominalType {
  private _name: string;
  private _fields: FieldMap = {};

  constructor(name: string, fields: FieldMap) {
    this._name = name;

    for(let prop in fields) {
      if(fields.hasOwnProperty(prop)) {
        this._fields[prop] = fields[prop];
      }
    }
  }

  get typeName() {
    return this._name;
  }

  get fields() {
    return this._fields;
  }
}

export const Null = new NominalType('Null', {});
export const Int32 = new NominalType('Int32', {});
export const Float64 = new NominalType('Float64', {});
export const Bool = new NominalType('Bool', {});
export const Byte = new NominalType('Byte', {});

export class UnionType {
  private _types: Type[];

  constructor(types: Type[]) {
    this._types = types;
  }

  get types() {
    return this._types;
  }
}

export const Num = new UnionType([ Int32, Float64 ]);

export class IntersectionType {
  private _types: Type[];

  constructor(types: Type[]) {
    this._types = types;
  }

  get types() {
    return this._types;
  }
}

export class TypeVar {
  private _constraint: Type;
  constructor(constraint: Type) {
    this._constraint = constraint;
  }
  get constraint() {
    return this._constraint;
  }
}

export interface FnTypeDefinition {
  argType: TypeVar;
  next: FnTypeDefinition|TypeVar;
}

export class FnTypeBuilder {
  private _args: TypeVar[] = [];

  takes(tVar: TypeVar) {
    this._args.push(tVar);
    return this;
  }

  returns(tVar: TypeVar) {
    this.takes(tVar);
    return this._done();
  }

  private _done() {
    const numArgs = this._args.length;

    let current: FnTypeDefinition = {
      argType: this._args[numArgs - 2],
      next: this._args[numArgs - 1],
    };

    for(let i = this._args.length - 3; i >= 0; i--) {
      current = {
        argType: this._args[i],
        next: current,
      };
    }

    return new FnType(current);
  }

}

export class FnType {
  private _defn: FnTypeDefinition;

  constructor(defn: FnTypeDefinition) {
    this._defn = defn;
  }

  get definition() {
    return this._defn;
  }

  static build() {
    return new FnTypeBuilder();
  }
}

export class LambdaDeltaType {
}

