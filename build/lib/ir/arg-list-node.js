'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ast_node_1 = require('../ast/ast-node');
var ArgListNode = (function (_super) {
    __extends(ArgListNode, _super);
    function ArgListNode(args) {
        _super.call(this, args.line);
        this._args = args.args;
    }
    Object.defineProperty(ArgListNode.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    ArgListNode.prototype.clone = function () {
        return new ArgListNode({
            line: this.line,
            args: this._args,
        });
    };
    return ArgListNode;
})(ast_node_1.AstNode);
exports.ArgListNode = ArgListNode;
