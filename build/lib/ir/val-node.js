'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ast_node_1 = require('../ast/ast-node');
var ValNode = (function (_super) {
    __extends(ValNode, _super);
    function ValNode(args) {
        _super.call(this, args.line);
        this._refname = args.refname;
        this._body = args.body;
    }
    Object.defineProperty(ValNode.prototype, "refname", {
        get: function () {
            return this._refname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValNode.prototype, "body", {
        get: function () {
            return this._body;
        },
        enumerable: true,
        configurable: true
    });
    ValNode.prototype.clone = function () {
        return new ValNode(this);
    };
    return ValNode;
})(ast_node_1.AstNode);
exports.ValNode = ValNode;
