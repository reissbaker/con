///<reference path="./typings/tsd.d.ts"/>
'use strict';
var fs = require('fs');
var token = require('./lib/token');
var lex_1 = require('./lib/lex');
var parse_1 = require('./lib/parse');
var lower_1 = require('./lib/lower');
var tree_string_1 = require('./lib/formatters/tree-string');
var interpret_1 = require('./lib/interpreter/interpret');
if (process.argv.length <= 3) {
    console.log("con (v0.0.1)\n\n    Usage: con build input-file.con\n\nA fast, low-level, typed Scheme with manual memory management.");
    process.exit(0);
}
var srcPath = process.argv[3];
var src = fs.readFileSync(srcPath, 'utf-8');
heading('Input source', srcPath);
console.log(src);
var tokens = lex_1.default(src);
heading("Tokens", srcPath);
console.log(token.prettyString(tokens));
var ast = parse_1.default(tokens);
heading("Initial parse", srcPath);
console.log(tree_string_1.default(ast));
var ir = lower_1.default(ast);
heading("Intermediate representation", srcPath);
console.log(tree_string_1.default(ir));
var interpreted = interpret_1.default(ir);
heading("Interpretation", srcPath);
console.log(interpreted);
function heading(title, srcPath) {
    var separator = '----------------------------------------------------------------';
    console.log("\n" + separator);
    console.log(title + ": " + srcPath);
    console.log(separator);
}
