///<reference path="./typings/tsd.d.ts"/>

'use strict';

import * as fs from 'fs';
import * as token from './lib/token';
import lex from './lib/lex';
import parse from './lib/parse';
import lower from './lib/lower';
import treeString from './lib/formatters/tree-string';
import interpret from './lib/interpreter/interpret';

if(process.argv.length <= 3) {
  console.log(
`con (v0.0.1)

    Usage: con build input-file.con

A fast, low-level, typed Scheme with manual memory management.`
  );
  process.exit(0);
}

const srcPath = process.argv[3];

const src = fs.readFileSync(srcPath, 'utf-8');
heading('Input source', srcPath);
console.log(src);

const tokens = lex(src);
heading("Tokens", srcPath);
console.log(token.prettyString(tokens));

const ast = parse(tokens);
heading("Initial parse", srcPath);
console.log(treeString(ast));

const ir = lower(ast);
heading("Intermediate representation", srcPath);
console.log(treeString(ir));

const interpreted = interpret(ir);
heading("Interpretation", srcPath);
console.log(interpreted);

function heading(title: string, srcPath: string) {
  const separator = '----------------------------------------------------------------';

  console.log(`\n${separator}`);
  console.log(`${title}: ${srcPath}`);
  console.log(separator);
}
