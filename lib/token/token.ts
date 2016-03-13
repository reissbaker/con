'use strict';

import { TokenType } from './token-type';

export interface Token {
  tokenType: TokenType;
  line: number;
  source: string;
}
