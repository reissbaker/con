'use strict';

import { AstNode } from './ast/ast-node';
import { IntermediateNode } from './ast/intermediate-node';
import { match } from './ast/match';
import { Constant } from './ast/constant';
import { Reference } from './ast/reference';
import { Vector } from './ast/vector';
import { List } from './ast/list';
import { RootNode } from './ast/root-node';
import { DefNode } from './ir/def-node';
import { CallNode } from './ir/call-node';
import { ValNode } from './ir/val-node';
import { LetNode } from './ir/let-node';
import { VarListNode } from './ir/var-list-node';
import { VarTupleNode } from './ir/var-tuple-node';
import { ArgListNode } from './ir/arg-list-node';
import { Unit } from './ir/unit';

export default function lower(ast: AstNode): AstNode {
  return match<AstNode>(ast, {
    Constant: clone,
    Reference(ast: Reference) {
      if(ast.refname === "null") return new Unit(ast.line);
      return clone(ast);
    },
    Vector: cloneWithLoweredChildren((node) => new Vector(node.line)),
    Root: cloneWithLoweredChildren(() => new RootNode()),

    List(ast: List) {
      const head = ast.head;

      if(head instanceof Reference) {
        if(head.refname === "def") return parseDef(ast, head);
        if(head.refname === "val") return parseVal(ast, head);
        if(head.refname === "let") return parseLet(ast, head);
        return parseCall(ast, head);
      }

      return cloneAndLower(ast, () => new List(ast.line));
    },
  });
}

function clone<T extends AstNode>(node: T): AstNode {
  return node.clone();
}

function cloneWithLoweredChildren<T extends IntermediateNode>(builder: (node: T) => T) {
  return (node: T): AstNode => {
    return cloneAndLower<T>(node, builder);
  }
}

function cloneAndLower<Parent extends IntermediateNode>(
  parent: Parent,
  builder: (node?: Parent) => Parent
): Parent {
  const newParent = builder(parent);
  parent.children.forEach((child) => {
    newParent.addChild(lower(child));
  });
  return newParent;
}

function parseDef(ast: List, head: Reference) {
  const [ defNameNode, argList, body ] = ast.rest;
  const loweredDefNameNode = lower(defNameNode);
  const loweredArgList = lower(argList);

  if(loweredDefNameNode instanceof Reference) {
    return new DefNode({
      line: head.line,
      defName: loweredDefNameNode.refname,
      argList: parseArgList(loweredArgList),
      body: lower(body),
    });
  }

  throw new Error(`Error line ${defNameNode.line}: def name must be a symbol`);
}

function parseArgList(ast: AstNode) {
  if(ast instanceof Vector) {
     return new ArgListNode({
      line: ast.line,
      args: ast.children.map((child) => {
        if(child instanceof Reference) {
          return child;
        }
        else {
          throw new Error(`Error line ${child.line}: argument in arg list must be a reference`);
        }
      }),
    });
  }

  throw new Error(`Error line ${ast.line}: argument list must be a vector`);
}

function parseVal(ast: List, head: Reference) {
  const [ refnameNode, body ] = ast.rest;
  const loweredRefnameNode = lower(refnameNode);

  if(loweredRefnameNode instanceof Reference) {
    return new ValNode({
      line: head.line,
      refname: loweredRefnameNode.refname,
      body: lower(body),
    });
  }

  throw new Error(`Error line ${refnameNode.line}: val name must be a symbol`);
}

function parseLet(ast: List, head: Reference) {
  const [ varList, body ] = ast.rest;
  const loweredVarListNode = lower(varList);

  if(loweredVarListNode instanceof Vector) {
    return new LetNode({
      line: head.line,
      varListNode: parseVarList(loweredVarListNode),
      body: lower(body),
    });
  }

  throw new Error(`Error line ${loweredVarListNode.line}: second argument to let must be a vector`);
}

function parseVarList(varListNode: Vector) {
  const varListTuples: VarTupleNode[] = varListNode.children.map((child) => {
    if(child instanceof CallNode) {
      if(child.args.length !== 1) {
        throw new Error(`Error line ${child.line}: tuples in let must be two-element lists`);
      }

      return new VarTupleNode({
        line: child.line,
        refname: child.refname,
        body: child.args[0],
      });
    }

    console.log(child);
    throw new Error(`Error line ${child.line}: tuples in let must be lists of symbols and bodies`);
  });

  return new VarListNode({
    line: varListNode.line,
    tuples: varListTuples,
  });
}

function parseCall(ast: List, head: Reference) {
  return new CallNode({
    line: head.line,
    refname: head.refname,
    args: ast.rest.map(lower),
  });
}
