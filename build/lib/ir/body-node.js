'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ast_node_1 = require('../ast/ast-node');
var BodyNode = (function (_super) {
    __extends(BodyNode, _super);
    function BodyNode() {
        _super.apply(this, arguments);
    }
    return BodyNode;
})(ast_node_1.AstNode);
exports.BodyNode = BodyNode;
