'use strict';

import { AstNode } from '../ast/ast-node';
import { match } from '../ir/match-ir';
import { Value } from './value';
import { Vector } from '../ast/vector';
import { List } from '../ast/list';
import { Reference } from '../ast/reference';
import { Constant, ConstantType } from '../ast/constant';
import { RootNode } from '../ast/root-node';
import { DefNode } from '../ir/def-node';
import { CallNode } from '../ir/call-node';
import { ValNode } from '../ir/val-node';
import { LetNode } from '../ir/let-node';
import { ArgListNode } from '../ir/arg-list-node';
import { Unit } from '../ir/unit';
import { ScopeTree } from './scope';
import { Fn } from './fn';
import { Primitive } from './primitive';
import * as types from './types';
import { bindBuiltIns } from './built-ins';

export default function interpret(ast: AstNode) {
  const scope = new ScopeTree();
  bindBuiltIns(scope);
  return interpretWithScope(ast, scope);
}

const nullVal = new Value(types.Null);

function interpretWithScope(ast: AstNode, scope: ScopeTree): Value {
  return match<Value>(ast, {
    Constant(ast: Constant<any>) {
      let inferredType: types.NominalType;

      switch(ast.constantType) {
        case ConstantType.Int32:
          inferredType = types.Int32;
          break;
        case ConstantType.Float64:
          inferredType = types.Float64;
          break;
        case ConstantType.Bool:
          inferredType = types.Bool;
          break;
        default:
          throw new Error(`unknown constant type on line ${ast.line}`);
      }

      return new Primitive(inferredType, ast.value);
    },

    Reference(ast: Reference) {
      const val = scope.lookup(ast.refname);
      if(!val) throw new Error(`Reference to undefined variable ${ast.refname} on ${ast.line}`);

      return scope.lookup(ast.refname);
    },

    Vector(ast: Vector) {
      throw new Error('vectors not yet supported in the interpreter');
      return null;
    },

    List(ast: List) {
      throw new Error('raw lists should not appear in lowered ast');
      return null;
    },

    Root(ast: RootNode) {
      let value = nullVal;

      ast.children.forEach((child) => {
        value = interpretWithScope(child, scope);
      });

      return value;
    },

    DefNode(ast: DefNode) {
      // TODO: infer type
      const fnType = new types.FnType(null);

      scope.set(ast.defName, new Fn(fnType, (scope, args) => {
        if(ast.argList.args.length !== args.length) {
          // TODO: rely on typechecking and remove this
          throw new Error(`${ast.defName} expects ${ast.argList.args.length} arguments; recieved ${args.length}`);
        }

        const childScope = scope.child();
        for(let i = 0; i < args.length; i++) {
          childScope.set(ast.argList.args[i].refname, args[i]);
        }

        return interpretWithScope(ast.body, childScope);
      }));

      return nullVal;
    },

    CallNode(ast: CallNode) {
      const defnVal = scope.lookup(ast.refname);
      if(!defnVal) {
        throw new Error(`reference to undeclared variable ${ast.refname} on line ${ast.line}`);
      }

      if(defnVal instanceof Fn) {
        // TODO: typecheck
        const args = ast.args.map((arg) => {
          return interpretWithScope(arg, scope);
        });

        return defnVal.run(scope, args);
      }

      throw new Error(`attempted to call non-function ${ast.refname} on line ${ast.line}`);
      return null;
    },

    ValNode(ast: ValNode) {
      scope.set(ast.refname, interpretWithScope(ast.body, scope));
      return nullVal;
    },

    LetNode(ast: LetNode) {
      const childScope = scope.child();
      ast.varListNode.tuples.forEach((tuple) => {
        childScope.set(tuple.refname, interpretWithScope(tuple.body, childScope));
      });

      return interpretWithScope(ast.body, childScope);
    },

    ArgListNode(ast: ArgListNode) {
      throw new Error('raw arg lists should not appear in lowered ast');
      return null;
    },

    Unit(ast: Unit) {
      return nullVal;
    },
  });
}
