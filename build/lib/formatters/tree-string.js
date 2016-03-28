'use strict';
var vector_1 = require('../ast/vector');
var root_node_1 = require('../ast/root-node');
var match_ir_1 = require('../ir/match-ir');
function treeString(ast) {
    return prettyStringWithDepth(ast, 0);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = treeString;
function prettyStringWithDepth(ast, depth) {
    var pieces = [];
    match_ir_1.match(ast, {
        Constant: function (ast) {
            pieces.push("Const<" + ast.value + "> ");
        },
        Reference: function (ast) {
            pieces.push("Ref<" + ast.refname + "> ");
        },
        Vector: function (ast) {
            pieces.push("[ ");
            ast.children.forEach(function (child) {
                pieces.push(prettyStringWithDepth(child, depth + 1));
            });
            pieces[pieces.length - 1] = withoutFinalSpace(pieces[pieces.length - 1]);
            pieces.push(" ]");
        },
        List: function (ast) {
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
        DefNode: function (ast) {
            var argListStr = prettyStringWithDepth(ast.argList, depth);
            pieces.push("\n" + spacing(depth) + "Def " + ast.defName + " " + argListStr + " {");
            pieces.push(prettyStringWithDepth(ast.body, depth + 1));
            pieces[pieces.length - 1] = withoutFinalSpace(pieces[pieces.length - 1]);
            pieces.push("\n" + spacing(depth) + "}\n");
        },
        CallNode: function (ast) {
            var maybeNewline = '';
            var maybeSpacing = '';
            if (!(ast.parent instanceof vector_1.Vector)) {
                maybeNewline = "\n";
                maybeSpacing = spacing(depth);
            }
            pieces.push("" + maybeNewline + maybeSpacing + ast.refname + "(");
            ast.args.forEach(function (child) {
                pieces.push(prettyStringWithDepth(child, depth + 1));
            });
            pieces[pieces.length - 1] = withoutFinalSpace(pieces[pieces.length - 1]);
            pieces.push(")");
            // Leave one space after each top-level call
            if (ast.parent instanceof root_node_1.RootNode) {
                pieces.push("\n");
            }
        },
        ValNode: function (ast) {
            pieces.push("\n" + spacing(depth) + "val " + ast.refname + " = ");
            pieces.push(withoutStartingNewline(prettyStringWithDepth(ast.body, depth + 1)));
            pieces.push("\n");
        },
        LetNode: function (ast) {
            pieces.push("\n" + spacing(depth) + "let {");
            ast.varListNode.tuples.forEach(function (tuple) {
                pieces.push("\n" + spacing(depth + 1) + tuple.refname + ": ");
                pieces.push(withoutStartingNewline(prettyStringWithDepth(tuple.body, depth + 1)));
            });
            pieces.push("\n" + spacing(depth) + "} {");
            pieces.push(prettyStringWithDepth(ast.body, depth + 1));
            pieces.push("\n" + spacing(depth) + "}");
        },
        ArgListNode: function (ast) {
            pieces.push("ArgList<" + ast.args.map(function (ref) { return ref.refname; }).join(', ') + ">");
        },
        Unit: function (ast) {
            pieces.push("Unit");
        },
    });
    return pieces.join("");
}
function withoutFinalSpace(str) {
    if (str[str.length - 1] === ' ')
        return str.substring(0, str.length - 1);
    return str;
}
function withoutStartingNewline(str) {
    if (str[0] === " ")
        return withoutStartingNewline(str.substring(1));
    if (str[0] === "\n")
        return withoutStartingNewline(str.substring(1));
    return str;
}
function spacing(count) {
    var pieces = [];
    for (var i = 0; i < count; i++) {
        pieces.push(' ');
    }
    return pieces.join('');
}
