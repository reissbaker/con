'use strict';
var BuiltInFn = (function () {
    function BuiltInFn(typeObject, fn) {
        this._typeObject = typeObject;
    }
    Object.defineProperty(BuiltInFn.prototype, "typeObject", {
        get: function () {
            return this._typeObject;
        },
        enumerable: true,
        configurable: true
    });
    BuiltInFn.prototype.run = function (scope, args) {
        return this._fn(scope, args);
    };
    return BuiltInFn;
})();
exports.BuiltInFn = BuiltInFn;
