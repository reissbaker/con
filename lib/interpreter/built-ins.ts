'use strict';

import { AstNode } from '../ast/ast-node';
import { Fn, FnBody } from './fn';
import { ScopeTree } from './scope';
import { Type, FnType } from './types';
import { Value } from './value';
import { Primitive } from './primitive';
import * as types from './types';

export function bindBuiltIns(scope: ScopeTree) {
  set(scope, {
    name: '+',
    argTypes: [],
    returnType: null,
    body(scope: ScopeTree, args: Value[]): Value {
      if(args.length !== 2) throw new Error(`TODO: remove me. + should be typechecked`);
      const a = args[0];
      const b = args[1];
      if(a instanceof Primitive && b instanceof Primitive) {
        const aVal = a.value;
        const bVal = b.value;

        if(typeof aVal === 'number' && typeof bVal === 'number') {
          // TODO: handle floats
          return new Primitive(types.PrimitiveType.Int32, aVal + bVal);
        }
        throw new Error(`TODO: remove me. + should be typechecked`);
      }
      throw new Error(`TODO: remove me. + should be typechecked`);
      return null;
    },
  });

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
