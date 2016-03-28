'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ast_node_1 = require('./ast-node');
(function (ConstantType) {
    ConstantType[ConstantType["Int32"] = 0] = "Int32";
    ConstantType[ConstantType["Float64"] = 1] = "Float64";
    ConstantType[ConstantType["Bool"] = 2] = "Bool";
})(exports.ConstantType || (exports.ConstantType = {}));
var ConstantType = exports.ConstantType;
var Constant = (function (_super) {
    __extends(Constant, _super);
    function Constant(line, type, value) {
        _super.call(this, line);
        this._value = value;
        this._type = type;
    }
    Constant.prototype.clone = function () {
        return new Constant(this.line, this._type, this._value);
    };
    Object.defineProperty(Constant.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constant.prototype, "constantType", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    return Constant;
})(ast_node_1.AstNode);
exports.Constant = Constant;
