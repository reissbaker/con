'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var value_1 = require('./value');
var Fn = (function (_super) {
    __extends(Fn, _super);
    function Fn(typeObject, fn) {
        _super.call(this, typeObject);
        this._body = fn;
    }
    Fn.prototype.run = function (scope, args) {
        return this._body(scope, args);
    };
    return Fn;
})(value_1.Value);
exports.Fn = Fn;
