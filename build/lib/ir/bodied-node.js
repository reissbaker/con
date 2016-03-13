'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ast_node_1 = require('../ast/ast-node');
var BodiedNode = (function (_super) {
    __extends(BodiedNode, _super);
    function BodiedNode(line, body) {
        _super.call(this, line);
        this._body = body;
    }
    Object.defineProperty(BodiedNode.prototype, "body", {
        get: function () {
            return this._body;
        },
        enumerable: true,
        configurable: true
    });
    return BodiedNode;
})(ast_node_1.AstNode);
exports.BodiedNode = BodiedNode;
