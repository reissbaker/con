'use strict';

import { AstNode } from './ast-node';
import { Constant } from './constant';
import { Reference } from './reference';
import { Vector } from './vector';
import { List } from './list';
import { RootNode } from './root-node';

type Arm<T extends AstNode, R> = (node: T) => R;

export interface Match<R> {
  Constant: Arm<Constant<any>, R>;
  Reference: Arm<Reference, R>;
  Vector: Arm<Vector, R>;
  List: Arm<List, R>;
  Root: Arm<RootNode, R>;
  _?: Arm<AstNode, R>;
}

export function match<R>(node: AstNode, arms: Match<R>): R {
  if(node instanceof Constant) {
    return arms.Constant(node);
  }
  else if(node instanceof Reference) {
    return arms.Reference(node);
  }
  else if(node instanceof Vector) {
    return arms.Vector(node);
  }
  else if(node instanceof List) {
    return arms.List(node);
  }
  else if(node instanceof RootNode) {
    return arms.Root(node);
  }
  else if(arms._) {
    return arms._(node);
  }
  else {
    throw new Error(`unknown AST node type on line ${node.line}`);
  }
}
