'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ast_node_1 = require('../ast/ast-node');
var VarListNode = (function (_super) {
    __extends(VarListNode, _super);
    function VarListNode(args) {
        _super.call(this, args.line);
        this._tuples = args.tuples;
    }
    Object.defineProperty(VarListNode.prototype, "tuples", {
        get: function () {
            return this._tuples;
        },
        enumerable: true,
        configurable: true
    });
    VarListNode.prototype.clone = function () {
        return null;
    };
    return VarListNode;
})(ast_node_1.AstNode);
exports.VarListNode = VarListNode;
