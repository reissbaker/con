'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ast_node_1 = require('./ast-node');
var Reference = (function (_super) {
    __extends(Reference, _super);
    function Reference(line, refname) {
        _super.call(this, line);
        this._refname = refname;
    }
    Object.defineProperty(Reference.prototype, "refname", {
        get: function () {
            return this._refname;
        },
        enumerable: true,
        configurable: true
    });
    Reference.prototype.clone = function () {
        return new Reference(this.line, this._refname);
    };
    return Reference;
})(ast_node_1.AstNode);
exports.Reference = Reference;
