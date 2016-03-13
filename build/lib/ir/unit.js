'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ast_node_1 = require('../ast/ast-node');
var Unit = (function (_super) {
    __extends(Unit, _super);
    function Unit() {
        _super.apply(this, arguments);
    }
    Unit.prototype.clone = function () {
        return new Unit(this.line);
    };
    return Unit;
})(ast_node_1.AstNode);
exports.Unit = Unit;
