'use strict';
var constant_1 = require('./constant');
var reference_1 = require('./reference');
var vector_1 = require('./vector');
var list_1 = require('./list');
var root_node_1 = require('./root-node');
function match(node, arms) {
    if (node instanceof constant_1.Constant) {
        return arms.Constant(node);
    }
    else if (node instanceof reference_1.Reference) {
        return arms.Reference(node);
    }
    else if (node instanceof vector_1.Vector) {
        return arms.Vector(node);
    }
    else if (node instanceof list_1.List) {
        return arms.List(node);
    }
    else if (node instanceof root_node_1.RootNode) {
        return arms.Root(node);
    }
    else if (arms._) {
        return arms._(node);
    }
    else {
        throw new Error("unknown AST node type on line " + node.line);
    }
}
exports.match = match;
