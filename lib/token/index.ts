'use strict';

import { TokenType, TokenTypeArgs } from './token-type';
import { Token } from './token';
import * as matchers from './matchers';

export { Token } from './token';
export { TokenType } from './token-type';

export const allTypes: TokenType[] = [];

function def(typedef: TokenTypeArgs): TokenType {
  const tokenType = new TokenType(typedef);
  allTypes.push(tokenType);
  return tokenType;
}

export const BlockComment = def({
  name: "BlockComment",
  match: matchers.beginend(";*", "*;"),
});

export const LineComment = def({
  name: "LineComment",
  match: matchers.regex(";[^\\n\\*]*"),
  validate(str: string) {
    return str.length > 1 && str[1] == ";";
  }
});

export const Newline = def({
  name: "Newline",
  match: matchers.exact("\n"),
});

export const Space = def({
  name: "Space",
  match: matchers.regex(" +"),
});

export const OpenParen = def({
  name: "OpenParen",
  match: matchers.exact("("),
});

export const CloseParen = def({
  name: "CloseParen",
  match: matchers.exact(")"),
});

export const OpenBracket = def({
  name: "OpenBracket",
  match: matchers.exact("["),
});

export const CloseBracket = def({
  name: "CloseBracket",
  match: matchers.exact("]"),
});

export const Reference = def({
  name: "Reference",
  match: matchers.regex("([a-z]|-|_|[A-Z])+([!|\\?])?"),
});

const numericRegex = /^(-)?\d+(\.\d+)?$/;
export const Num = def({
  name: "Num",
  match: matchers.regex("(-)?\\d+(\\.\\d*)?"),
  validate(str: string) {
    return !!str.match(numericRegex);
  },
});

export const Operator = def({
  name: "Operator",
  match: matchers.regex("(\\+|-|\\*|/|=|!|!=|&&|\\|\\||\\||&|>|<|<=|>=|>>|<<)"),
});

const CONTENT_TYPES = [
  Reference,
  Num,
  Operator,
];
export function prettyString(tokens: Token[]): string {
  const pieces: string[] = [];
  tokens.forEach((token) => {
    if(CONTENT_TYPES.indexOf(token.tokenType) >= 0) {
      pieces.push(`${token.tokenType.typeName}(${token.source})`);
    }
    else {
      pieces.push(token.tokenType.typeName);
    }
  });
  return pieces.join(" ");
}
