'use strict';
var astm = require('../ast/match');
var def_node_1 = require('./def-node');
var call_node_1 = require('./call-node');
var val_node_1 = require('./val-node');
var let_node_1 = require('./let-node');
var arg_list_node_1 = require('./arg-list-node');
var unit_1 = require('./unit');
function match(node, arms) {
    return astm.match(node, {
        Constant: arms.Constant,
        Reference: arms.Reference,
        Vector: arms.Vector,
        List: arms.List,
        Root: arms.Root,
        _: function (node) {
            if (node instanceof def_node_1.DefNode) {
                return arms.DefNode(node);
            }
            else if (node instanceof call_node_1.CallNode) {
                return arms.CallNode(node);
            }
            else if (node instanceof val_node_1.ValNode) {
                return arms.ValNode(node);
            }
            else if (node instanceof let_node_1.LetNode) {
                return arms.LetNode(node);
            }
            else if (node instanceof arg_list_node_1.ArgListNode) {
                return arms.ArgListNode(node);
            }
            else if (node instanceof unit_1.Unit) {
                return arms.Unit(node);
            }
            else if (arms._) {
                return arms._(node);
            }
            else {
                throw new Error("unknown AST node type on line " + node.line);
            }
        }
    });
}
exports.match = match;
