'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ast_node_1 = require('./ast-node');
(function (ConstantType) {
    ConstantType[ConstantType["Int32"] = 0] = "Int32";
    ConstantType[ConstantType["Int16"] = 1] = "Int16";
    ConstantType[ConstantType["Int8"] = 2] = "Int8";
    ConstantType[ConstantType["Uint32"] = 3] = "Uint32";
    ConstantType[ConstantType["Uint16"] = 4] = "Uint16";
    ConstantType[ConstantType["Uint8"] = 5] = "Uint8";
    ConstantType[ConstantType["Float64"] = 6] = "Float64";
    ConstantType[ConstantType["Float32"] = 7] = "Float32";
    ConstantType[ConstantType["Float16"] = 8] = "Float16";
    ConstantType[ConstantType["Float8"] = 9] = "Float8";
    ConstantType[ConstantType["Bool"] = 10] = "Bool";
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
