'use strict';

import * as token from './token';
import { RootNode } from './ast/root-node';
import { Vector } from './ast/vector';
import { List } from './ast/list';
import { IntermediateNode } from './ast/intermediate-node';
import { Reference } from './ast/reference';
import { ConstantType, Constant } from './ast/constant';

const intRegex = /^(-)?\d+$/;

export default function parse(tokens: token.Token[]) {
  const root = new RootNode();
  let current: IntermediateNode = root;
  const parenMatcher = new MatchCounter();
  const bracketMatcher = new MatchCounter();

  tokens.forEach((t) => {
    if(t.tokenType === token.OpenParen) {
      current = current.addChild(new List(t.line));
      parenMatcher.open(t.line);
    }
    else if(t.tokenType === token.CloseParen) {
      current = current.parent;
      parenMatcher.close();
    }
    else if(t.tokenType === token.OpenBracket) {
      current = current.addChild(new Vector(t.line));
      bracketMatcher.open(t.line);
    }
    else if(t.tokenType === token.CloseBracket) {
      current = current.parent;
      bracketMatcher.close();
    }
    else if(t.tokenType === token.Reference || t.tokenType === token.Operator) {
      if(t.source === "true") {
        current.addChild(new Constant<boolean>(t.line, ConstantType.Bool, true));
      }
      else if(t.source === "false") {
        current.addChild(new Constant<boolean>(t.line, ConstantType.Bool, false));
      }
      else {
        current.addChild(new Reference(t.line, t.source));
      }
    }
    else if(t.tokenType === token.Num) {
      if(t.source.match(intRegex)) {
        current.addChild(new Constant<number>(t.line, ConstantType.Int32, parseInt(t.source, 10)));
      }
      else {
        current.addChild(new Constant<number>(t.line, ConstantType.Float64, parseFloat(t.source)));
      }
    }
    else {
      throw new Error('unknown token type');
    }
  });

  if(!parenMatcher.matched()) throw new Error(`Unmatched ( on line ${parenMatcher.lastLine}`);
  if(!bracketMatcher.matched()) throw new Error(`Unmatched [ on line ${parenMatcher.lastLine}`);

  return root;
}

class MatchCounter {
  private _count = 0;
  private _lastLine = -1;

  open(line: number) {
    if(this._count === 0) this._lastLine = line;
    this._count++;
  }

  close() {
    this._count--;
  }

  matched() {
    return this._count === 0;
  }

  get lastLine() {
    return this._lastLine;
  }
}
