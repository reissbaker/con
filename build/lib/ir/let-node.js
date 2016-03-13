'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ast_node_1 = require('../ast/ast-node');
var LetNode = (function (_super) {
    __extends(LetNode, _super);
    function LetNode(args) {
        _super.call(this, args.line);
        this._varListNode = args.varListNode;
        this._body = args.body;
    }
    Object.defineProperty(LetNode.prototype, "varListNode", {
        get: function () {
            return this._varListNode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LetNode.prototype, "body", {
        get: function () {
            return this._body;
        },
        enumerable: true,
        configurable: true
    });
    LetNode.prototype.clone = function () {
        return null;
    };
    return LetNode;
})(ast_node_1.AstNode);
exports.LetNode = LetNode;
