'use strict';

import { AstNode } from '../ast/ast-node';
import { Fn, FnBody } from './fn';
import { ScopeTree } from './scope';
import { Type, FnType } from './types';
import { Value } from './value';
import { Primitive } from './primitive';
import * as types from './types';

export function bindBuiltIns(scope: ScopeTree) {
  set(scope, arithmetic('+', (a, b) => a + b));
  set(scope, arithmetic('-', (a, b) => a - b));
  set(scope, arithmetic('*', (a, b) => a * b));
  set(scope, arithmetic('/', (a, b) => a / b));
}

interface FnBuilder {
  name: string;
  argTypes: Type[];
  returnType: Type;
  body: FnBody;
}

function set(scope: ScopeTree, builder: FnBuilder) {
  const fnType = new FnType(builder.argTypes, builder.returnType);
  scope.set(builder.name, new Fn(fnType, builder.body));
}

function arithmetic(name: string, fn: (a: number, b: number) => number): FnBuilder {
  return {
    name,
    argTypes: [],
    returnType: null,
    body(scope: ScopeTree, args: Value[]) {
      if(args.length !== 2) throw new Error(`TODO: remove me. ${name} should be typechecked`);
      const a = args[0];
      const b = args[1];

      if(a instanceof Primitive && b instanceof Primitive) {
        const aVal = a.value;
        const bVal = b.value;

        if(typeof aVal === 'number' && typeof bVal === 'number') {
          // TODO: handle floats
          const val = fn(a.value, b.value);
          return new Primitive(types.PrimitiveType.Int32, val);
        }

        throw new Error(`TODO: remove me. ${name} should be typechecked`);
      }

      throw new Error(`TODO: remove me. ${name} should be typechecked`);
      return null;
    }
  };
}
