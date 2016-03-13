'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ast_node_1 = require('../ast/ast-node');
var DefNode = (function (_super) {
    __extends(DefNode, _super);
    function DefNode(args) {
        _super.call(this, args.line);
        this._body = args.body;
        this._defName = args.defName;
        this._argList = args.argList;
    }
    Object.defineProperty(DefNode.prototype, "body", {
        get: function () {
            return this._body;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefNode.prototype, "defName", {
        get: function () {
            return this._defName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefNode.prototype, "argList", {
        get: function () {
            return this._argList;
        },
        enumerable: true,
        configurable: true
    });
    DefNode.prototype.clone = function () {
        return null;
    };
    return DefNode;
})(ast_node_1.AstNode);
exports.DefNode = DefNode;
