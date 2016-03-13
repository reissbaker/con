'use strict';
var vector_1 = require('./vector');
var root_node_1 = require('./root-node');
var match_1 = require('./match');
function prettyString(ast) {
    return prettyStringWithDepth(ast, 0);
}
exports.prettyString = prettyString;
function prettyStringWithDepth(ast, depth) {
    var pieces = [];
    match_1.match(ast, {
        Constant: function (ast) {
            pieces.push("Const(" + ast.value + ") ");
        },
        Reference: function (ast) {
            pieces.push("Ref(" + ast.refname + ") ");
        },
        Vector: function (ast) {
            pieces.push("[");
            ast.children.forEach(function (child) {
                pieces.push(prettyStringWithDepth(child, depth + 1));
            });
            pieces[pieces.length - 1] = withoutFinalSpace(pieces[pieces.length - 1]);
            pieces.push("]");
        },
        Call: function (ast) {
            var maybeNewline = '';
            var maybeSpacing = '';
            if (!(ast.parent instanceof vector_1.Vector)) {
                maybeNewline = "\n";
                maybeSpacing = spacing(depth);
            }
            pieces.push("" + maybeNewline + maybeSpacing + "(");
            ast.children.forEach(function (child) {
                pieces.push(prettyStringWithDepth(child, depth + 1));
            });
            pieces[pieces.length - 1] = withoutFinalSpace(pieces[pieces.length - 1]);
            pieces.push(")");
            // Leave one space after each top-level call
            if (ast.parent instanceof root_node_1.RootNode) {
                pieces.push("\n");
            }
        },
        Root: function (ast) {
            pieces.push("Root(\n");
            ast.children.forEach(function (child) {
                pieces.push(prettyStringWithDepth(child, depth + 1));
            });
            pieces.push("\n)");
        },
    });
    return pieces.join("");
}
function withoutFinalSpace(str) {
    if (str[str.length - 1] === ' ')
        return str.substring(0, str.length - 1);
    return str;
}
function spacing(count) {
    var pieces = [];
    for (var i = 0; i < count; i++) {
        pieces.push(' ');
    }
    return pieces.join('');
}
