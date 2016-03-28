import * as token from './token';

export default function lex(source: string): token.Token[] {
  const tokens = parse(source);
  return tokens.filter(filterTypes([
    token.BlockComment,
    token.LineComment,
    token.Newline,
    token.Space,
  ]));
}

function parse(line: string): token.Token[] {
  let lineNumber = 1;
  const tokens: token.Token[] = [];
  let beginIndex = 0;
  let currentTokenType: token.TokenType = null;
  let lastTokenType: token.TokenType = null;
  let i = 1;

  for(i; i <= line.length; i++) {
    if(line[i] === '\n') lineNumber++;

    const substr = line.substring(beginIndex, i);

    currentTokenType = findValidTokenTypeFor(substr);

    if(currentTokenType) {
      lastTokenType = currentTokenType;
    }
    else {
      const prevSubstr = line.substring(beginIndex, i - 1);

      if(!lastTokenType) {
        throw new Error(parseErrorString(lineNumber, substr));
      }

      tokens.push(lastTokenType.token(prevSubstr, lineNumber));
      beginIndex = i - 1;
      currentTokenType = findValidTokenTypeFor(line.substring(beginIndex, i));
      lastTokenType = currentTokenType;
    }
  }

  const prevSubstr = line.substring(beginIndex, i - 1);

  if(lastTokenType) {
    tokens.push(lastTokenType.token(prevSubstr, lineNumber));
  }

  // If there was remaining input, but no parseable token type, throw
  else if(prevSubstr !== "") {
    throw new Error(parseErrorString(lineNumber, prevSubstr));
  }

  return tokens;
}

function and<T>(predA: (x: T) => boolean, predB: (x: T) => boolean) {
  return (x: T) => predA(x) && predB(x);
}

function filterTypes(types: token.TokenType[]): (t: token.Token) => boolean {
  const firstFilter = filterType(types[0]);
  if(types.length === 1) return firstFilter;
  return and(firstFilter, filterTypes(types.slice(1)));
}

function filterType(tokenType: token.TokenType): (t: token.Token) => boolean {
  return (t: token.Token) => t.tokenType !== tokenType;
}

function findValidTokenTypeFor(str: string): token.TokenType {
  for(var i = 0; i < token.allTypes.length; i++) {
    const tokenType = token.allTypes[i];
    if(tokenType.match(str)) return tokenType;
  }
  return null;
}

function parseErrorString(line: number, str: string) {
  return `Unparseable string on line ${line}: ${str}`;
}
