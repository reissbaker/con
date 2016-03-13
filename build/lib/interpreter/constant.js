'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var value_1 = require('./value');
var Primitive = (function (_super) {
    __extends(Primitive, _super);
    function Primitive(value, primitiveType) {
        _super.call(this, primitiveType);
        this._value = value;
    }
    Object.defineProperty(Primitive.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return Primitive;
})(value_1.Value);
exports.Primitive = Primitive;
