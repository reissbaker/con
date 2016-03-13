'use strict';

import * as token from './token';

export type SourcePredicate = (str: string) => boolean;

export interface TokenTypeArgs {
  match: SourcePredicate;
  validate?: SourcePredicate;
  name: string;
}

const alwaysValid = (str: string) => true;

export class TokenType {
  match: SourcePredicate;
  private _validate: SourcePredicate;
  private _typeName: string;

  constructor(args: TokenTypeArgs) {
    this.match = args.match;
    this._validate = args.validate || alwaysValid;
    this._typeName = args.name;
  }

  token(source: string, line: number): token.Token {
    if(!this._validate(source)) {
      throw new Error(`Invalid ${this._typeName} syntax on line ${line}: ${source}`);
    }

    return {
      line,
      source,
      tokenType: this,
    };
  }

  get typeName() { return this._typeName; }
}
