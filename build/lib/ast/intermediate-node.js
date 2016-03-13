'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ast_node_1 = require('./ast-node');
var IntermediateNode = (function (_super) {
    __extends(IntermediateNode, _super);
    function IntermediateNode() {
        _super.apply(this, arguments);
        this._children = [];
    }
    IntermediateNode.prototype.addChild = function (node) {
        this._children.push(node);
        node.parent = this;
        return node;
    };
    Object.defineProperty(IntermediateNode.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    IntermediateNode.prototype.addClonesOf = function (children) {
        var _this = this;
        children.forEach(function (child) {
            _this.addChild(child.clone());
        });
    };
    return IntermediateNode;
})(ast_node_1.AstNode);
exports.IntermediateNode = IntermediateNode;
