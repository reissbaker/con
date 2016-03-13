'use strict';
var Value = (function () {
    function Value(typeObject) {
        this._typeObject = typeObject;
    }
    Object.defineProperty(Value.prototype, "typeObject", {
        get: function () {
            return this._typeObject;
        },
        enumerable: true,
        configurable: true
    });
    return Value;
})();
exports.Value = Value;
