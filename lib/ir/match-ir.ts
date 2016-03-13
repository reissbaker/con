'use strict';

import { AstNode } from '../ast/ast-node';
import * as astm from '../ast/match';
import { Constant } from '../ast/constant';
import { Reference } from '../ast/reference';
import { Vector } from '../ast/vector';
import { List } from '../ast/list';
import { RootNode } from '../ast/root-node';
import { DefNode } from './def-node';
import { CallNode } from './call-node';
import { ValNode } from './val-node';
import { LetNode } from './let-node';
import { ArgListNode } from './arg-list-node';
import { Unit } from './unit';

type Arm<T extends AstNode, R> = (node: T) => R;

export interface Match<R> {
  Constant: Arm<Constant<any>, R>;
  Reference: Arm<Reference, R>;
  Vector: Arm<Vector, R>;
  List: Arm<List, R>;
  Root: Arm<RootNode, R>;
  DefNode: Arm<DefNode, R>;
  CallNode: Arm<CallNode, R>;
  ValNode: Arm<ValNode, R>;
  LetNode: Arm<LetNode, R>;
  ArgListNode: Arm<ArgListNode, R>;
  Unit: Arm<Unit, R>;

  _?: Arm<AstNode, R>;
}

export function match<R>(node: AstNode, arms: Match<R>): R {
  return astm.match<R>(node, {
    Constant: arms.Constant,
    Reference: arms.Reference,
    Vector: arms.Vector,
    List: arms.List,
    Root: arms.Root,
    _: (node: AstNode) => {
      if(node instanceof DefNode) {
        return arms.DefNode(node);
      }
      else if(node instanceof CallNode) {
        return arms.CallNode(node);
      }
      else if(node instanceof ValNode) {
        return arms.ValNode(node);
      }
      else if(node instanceof LetNode) {
        return arms.LetNode(node);
      }
      else if(node instanceof ArgListNode) {
        return arms.ArgListNode(node);
      }
      else if(node instanceof Unit) {
        return arms.Unit(node);
      }
      else if(arms._) {
        return arms._(node);
      }
      else {
        throw new Error(`unknown AST node type on line ${node.line}`);
      }
    }
  });
}
