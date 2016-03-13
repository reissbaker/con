'use strict';

import { AstNode } from '../ast/ast-node';
import { Vector } from '../ast/vector';
import { List } from '../ast/list';
import { Reference } from '../ast/reference';
import { Constant } from '../ast/constant';
import { RootNode } from '../ast/root-node';
import { DefNode } from '../ir/def-node';
import { CallNode } from '../ir/call-node';
import { ValNode } from '../ir/val-node';
import { LetNode } from '../ir/let-node';
import { match } from '../ir/match-ir';
import { ArgListNode } from '../ir/arg-list-node';
import { Unit } from '../ir/unit';

export default function treeString(ast: AstNode): string {
  return prettyStringWithDepth(ast, 0);
}

function prettyStringWithDepth(ast: AstNode, depth: number) {
  const pieces: string[] = [];

  match(ast, {
    Constant(ast: Constant<any>) {
      pieces.push(`Const<${ast.value}> `);
    },

    Reference(ast: Reference) {
      pieces.push(`Ref<${ast.refname}> `);
    },

    Vector(ast: Vector) {
      pieces.push("[ ");
      ast.children.forEach((child) => {
        pieces.push(prettyStringWithDepth(child, depth + 1));
      });
      pieces[pieces.length - 1] = withoutFinalSpace(pieces[pieces.length - 1]);
      pieces.push(" ]");
    },

    List(ast: List) {
      let maybeNewline = '';
      let maybeSpacing = ''
      if(!(ast.parent instanceof Vector)) {
        maybeNewline = "\n";
        maybeSpacing = spacing(depth);
      }

      pieces.push(`${maybeNewline}${maybeSpacing}(`);
      ast.children.forEach((child) => {
        pieces.push(prettyStringWithDepth(child, depth + 1));
      });

      pieces[pieces.length - 1] = withoutFinalSpace(pieces[pieces.length - 1]);
      pieces.push(")");

      // Leave one space after each top-level call
      if(ast.parent instanceof RootNode) {
        pieces.push("\n");
      }
    },

    Root(ast: RootNode) {
      pieces.push("Root(\n");
      ast.children.forEach((child) => {
        pieces.push(prettyStringWithDepth(child, depth + 1));
      });
      pieces.push("\n)");
    },

    DefNode(ast: DefNode) {
      const argListStr = prettyStringWithDepth(ast.argList, depth);
      pieces.push(`\n${spacing(depth)}Def ${ast.defName} ${argListStr} {`);
      pieces.push(prettyStringWithDepth(ast.body, depth + 1));
      pieces[pieces.length - 1] = withoutFinalSpace(pieces[pieces.length - 1]);
      pieces.push(`\n${spacing(depth)}}\n`);
    },

    CallNode(ast: CallNode) {
      let maybeNewline = '';
      let maybeSpacing = ''
      if(!(ast.parent instanceof Vector)) {
        maybeNewline = "\n";
        maybeSpacing = spacing(depth);
      }

      pieces.push(`${maybeNewline}${maybeSpacing}${ast.refname}(`);
      ast.args.forEach((child) => {
        pieces.push(prettyStringWithDepth(child, depth + 1));
      });

      pieces[pieces.length - 1] = withoutFinalSpace(pieces[pieces.length - 1]);
      pieces.push(")");

      // Leave one space after each top-level call
      if(ast.parent instanceof RootNode) {
        pieces.push("\n");
      }
    },

    ValNode(ast: ValNode) {
      pieces.push(`\n${spacing(depth)}val ${ast.refname} = `);
      pieces.push(withoutStartingNewline(prettyStringWithDepth(ast.body, depth + 1)));
      pieces.push("\n");
    },

    LetNode(ast: LetNode) {
      pieces.push(`\n${spacing(depth)}let {\n`);
      ast.varListNode.tuples.forEach((tuple) => {
        pieces.push(`${spacing(depth + 1)}${tuple.refname}: `);
        pieces.push(withoutStartingNewline(prettyStringWithDepth(tuple.body, depth + 1)));
      });
      pieces.push(`\n${spacing(depth)}} {`);
      pieces.push(prettyStringWithDepth(ast.body, depth + 1));
      pieces.push(`\n${spacing(depth)}}`);
    },

    ArgListNode(ast: ArgListNode) {
      pieces.push(`ArgList<${ ast.args.map(ref => ref.refname).join(', ') }>`);
    },

    Unit(ast: Unit) {
      pieces.push(`Unit`);
    },
  });

  return pieces.join("");
}

function withoutFinalSpace(str: string) {
  if(str[str.length - 1] === ' ') return str.substring(0, str.length - 1);
  return str;
}

function withoutStartingNewline(str: string): string {
  if(str[0] === " ") return withoutStartingNewline(str.substring(1));
  if(str[0] === "\n") return withoutStartingNewline(str.substring(1));
  return str;
}

function spacing(count: number) {
  const pieces: string[] = [];
  for(let i = 0; i < count; i++) {
    pieces.push(' ');
  }
  return pieces.join('');
}
