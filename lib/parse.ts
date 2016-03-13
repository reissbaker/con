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

  tokens.forEach((t) => {
    if(t.tokenType === token.OpenParen) {
      current = current.addChild(new List(t.line));
    }
    else if(t.tokenType === token.CloseParen) {
      current = current.parent;
    }
    else if(t.tokenType === token.OpenBracket) {
      current = current.addChild(new Vector(t.line));
    }
    else if(t.tokenType === token.CloseBracket) {
      current = current.parent;
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

  return root;
}
