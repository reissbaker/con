'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ast_node_1 = require('../ast/ast-node');
var CallNode = (function (_super) {
    __extends(CallNode, _super);
    function CallNode(args) {
        _super.call(this, args.line);
        this._refname = args.refname;
        this._args = args.args;
    }
    Object.defineProperty(CallNode.prototype, "refname", {
        get: function () {
            return this._refname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CallNode.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    CallNode.prototype.clone = function () {
        return null;
    };
    return CallNode;
})(ast_node_1.AstNode);
exports.CallNode = CallNode;
