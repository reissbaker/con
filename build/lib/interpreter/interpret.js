'use strict';
var match_ir_1 = require('../ir/match-ir');
var value_1 = require('./value');
var constant_1 = require('../ast/constant');
var scope_1 = require('./scope');
var fn_1 = require('./fn');
var primitive_1 = require('./primitive');
var types = require('./types');
var built_ins_1 = require('./built-ins');
function interpret(ast) {
    var scope = new scope_1.ScopeTree();
    built_ins_1.bindBuiltIns(scope);
    return interpretWithScope(ast, scope);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = interpret;
var nullVal = new value_1.Value(types.Null);
function interpretWithScope(ast, scope) {
    return match_ir_1.match(ast, {
        Constant: function (ast) {
            var inferredType;
            switch (ast.constantType) {
                case constant_1.ConstantType.Int32:
                    inferredType = types.Int32;
                    break;
                case constant_1.ConstantType.Float64:
                    inferredType = types.Float64;
                    break;
                case constant_1.ConstantType.Bool:
                    inferredType = types.Bool;
                    break;
                default:
                    throw new Error("unknown constant type on line " + ast.line);
            }
            return new primitive_1.Primitive(inferredType, ast.value);
        },
        Reference: function (ast) {
            var val = scope.lookup(ast.refname);
            if (!val)
                throw new Error("Reference to undefined variable " + ast.refname + " on " + ast.line);
            return scope.lookup(ast.refname);
        },
        Vector: function (ast) {
            throw new Error('vectors not yet supported in the interpreter');
            return null;
        },
        List: function (ast) {
            throw new Error('raw lists should not appear in lowered ast');
            return null;
        },
        Root: function (ast) {
            var value = nullVal;
            ast.children.forEach(function (child) {
                value = interpretWithScope(child, scope);
            });
            return value;
        },
        DefNode: function (ast) {
            // TODO: infer type
            var fnType = new types.FnType(null);
            scope.set(ast.defName, new fn_1.Fn(fnType, function (scope, args) {
                if (ast.argList.args.length !== args.length) {
                    // TODO: rely on typechecking and remove this
                    throw new Error(ast.defName + " expects " + ast.argList.args.length + " arguments; recieved " + args.length);
                }
                var childScope = scope.child();
                for (var i = 0; i < args.length; i++) {
                    childScope.set(ast.argList.args[i].refname, args[i]);
                }
                return interpretWithScope(ast.body, childScope);
            }));
            return nullVal;
        },
        CallNode: function (ast) {
            var defnVal = scope.lookup(ast.refname);
            if (!defnVal) {
                throw new Error("reference to undeclared function " + ast.refname + " on line " + ast.line);
            }
            if (defnVal instanceof fn_1.Fn) {
                // TODO: typecheck
                var args = ast.args.map(function (arg) {
                    return interpretWithScope(arg, scope);
                });
                return defnVal.run(scope, args);
            }
            throw new Error("attempted to call non-function " + ast.refname + " on line " + ast.line);
            return null;
        },
        ValNode: function (ast) {
            scope.set(ast.refname, interpretWithScope(ast.body, scope));
            return nullVal;
        },
        LetNode: function (ast) {
            var childScope = scope.child();
            ast.varListNode.tuples.forEach(function (tuple) {
                childScope.set(tuple.refname, interpretWithScope(tuple.body, childScope));
            });
            return interpretWithScope(ast.body, childScope);
        },
        ArgListNode: function (ast) {
            throw new Error('raw arg lists should not appear in lowered ast');
            return null;
        },
        Unit: function (ast) {
            return nullVal;
        },
    });
}
