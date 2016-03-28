'use strict';
var match_1 = require('./ast/match');
var reference_1 = require('./ast/reference');
var vector_1 = require('./ast/vector');
var list_1 = require('./ast/list');
var root_node_1 = require('./ast/root-node');
var def_node_1 = require('./ir/def-node');
var call_node_1 = require('./ir/call-node');
var val_node_1 = require('./ir/val-node');
var let_node_1 = require('./ir/let-node');
var var_list_node_1 = require('./ir/var-list-node');
var var_tuple_node_1 = require('./ir/var-tuple-node');
var arg_list_node_1 = require('./ir/arg-list-node');
var unit_1 = require('./ir/unit');
function lower(ast) {
    return match_1.match(ast, {
        Constant: clone,
        Reference: function (ast) {
            if (ast.refname === "null")
                return new unit_1.Unit(ast.line);
            return clone(ast);
        },
        Vector: cloneWithLoweredChildren(function (node) { return new vector_1.Vector(node.line); }),
        Root: cloneWithLoweredChildren(function () { return new root_node_1.RootNode(); }),
        List: function (ast) {
            var head = ast.head;
            if (head instanceof reference_1.Reference) {
                if (head.refname === "def")
                    return parseDef(ast, head);
                if (head.refname === "val")
                    return parseVal(ast, head);
                if (head.refname === "let")
                    return parseLet(ast, head);
                return parseCall(ast, head);
            }
            return cloneAndLower(ast, function () { return new list_1.List(ast.line); });
        },
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = lower;
function clone(node) {
    return node.clone();
}
function cloneWithLoweredChildren(builder) {
    return function (node) {
        return cloneAndLower(node, builder);
    };
}
function cloneAndLower(parent, builder) {
    var newParent = builder(parent);
    parent.children.forEach(function (child) {
        newParent.addChild(lower(child));
    });
    return newParent;
}
function parseDef(ast, head) {
    var _a = ast.rest, defNameNode = _a[0], argList = _a[1], body = _a[2];
    var loweredDefNameNode = lower(defNameNode);
    var loweredArgList = lower(argList);
    if (loweredDefNameNode instanceof reference_1.Reference) {
        return new def_node_1.DefNode({
            line: head.line,
            defName: loweredDefNameNode.refname,
            argList: parseArgList(loweredArgList),
            body: lower(body),
        });
    }
    throw new Error("Error line " + defNameNode.line + ": def name must be a symbol");
}
function parseArgList(ast) {
    if (ast instanceof vector_1.Vector) {
        return new arg_list_node_1.ArgListNode({
            line: ast.line,
            args: ast.children.map(function (child) {
                if (child instanceof reference_1.Reference) {
                    return child;
                }
                else {
                    throw new Error("Error line " + child.line + ": argument in arg list must be a reference");
                }
            }),
        });
    }
    throw new Error("Error line " + ast.line + ": argument list must be a vector");
}
function parseVal(ast, head) {
    var _a = ast.rest, refnameNode = _a[0], body = _a[1];
    var loweredRefnameNode = lower(refnameNode);
    if (loweredRefnameNode instanceof reference_1.Reference) {
        return new val_node_1.ValNode({
            line: head.line,
            refname: loweredRefnameNode.refname,
            body: lower(body),
        });
    }
    throw new Error("Error line " + refnameNode.line + ": val name must be a symbol");
}
function parseLet(ast, head) {
    var _a = ast.rest, varList = _a[0], body = _a[1];
    var loweredVarListNode = lower(varList);
    if (loweredVarListNode instanceof vector_1.Vector) {
        return new let_node_1.LetNode({
            line: head.line,
            varListNode: parseVarList(loweredVarListNode),
            body: lower(body),
        });
    }
    throw new Error("Error line " + loweredVarListNode.line + ": second argument to let must be a vector");
}
function parseVarList(varListNode) {
    // If this is a single-dimensional array, rather than a multi-dimensional array, rewrite it as a
    // multidimensional one before parsing.
    if (varListNode.children.length === 2) {
        var head = varListNode.children[0];
        if (head instanceof reference_1.Reference) {
            var shadowParent = new vector_1.Vector(varListNode.line);
            var children = varListNode.children;
            varListNode.overwriteChildren([shadowParent]);
            shadowParent.overwriteChildren(children);
        }
    }
    var varListTuples = varListNode.children.map(function (child) {
        if (child instanceof vector_1.Vector) {
            if (child.children.length !== 2) {
                throw new Error("Error line " + child.line + ": tuples in let must be two-element vectors");
            }
            var sym = child.children[0];
            var val = child.children[1];
            if (sym instanceof reference_1.Reference) {
                return new var_tuple_node_1.VarTupleNode({
                    line: child.line,
                    refname: sym.refname,
                    body: val,
                });
            }
        }
        throw new Error("Error line " + child.line + ": tuples in let must be lists of symbols and bodies");
    });
    return new var_list_node_1.VarListNode({
        line: varListNode.line,
        tuples: varListTuples,
    });
}
function parseCall(ast, head) {
    return new call_node_1.CallNode({
        line: head.line,
        refname: head.refname,
        args: ast.rest.map(lower),
    });
}
