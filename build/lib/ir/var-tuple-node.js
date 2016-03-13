'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ast_node_1 = require('../ast/ast-node');
var VarTupleNode = (function (_super) {
    __extends(VarTupleNode, _super);
    function VarTupleNode(args) {
        _super.call(this, args.line);
        this._refname = args.refname;
        this._body = args.body;
    }
    Object.defineProperty(VarTupleNode.prototype, "refname", {
        get: function () {
            return this._refname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VarTupleNode.prototype, "body", {
        get: function () {
            return this._body;
        },
        enumerable: true,
        configurable: true
    });
    VarTupleNode.prototype.clone = function () {
        return null;
    };
    return VarTupleNode;
})(ast_node_1.AstNode);
exports.VarTupleNode = VarTupleNode;
