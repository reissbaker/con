'use strict';
var alwaysValid = function (str) { return true; };
var TokenType = (function () {
    function TokenType(args) {
        this.match = args.match;
        this._validate = args.validate || alwaysValid;
        this._typeName = args.name;
    }
    TokenType.prototype.token = function (source, line) {
        if (!this._validate(source)) {
            throw new Error("Invalid " + this._typeName + " syntax on line " + line + ": " + source);
        }
        return {
            line: line,
            source: source,
            tokenType: this,
        };
    };
    Object.defineProperty(TokenType.prototype, "typeName", {
        get: function () { return this._typeName; },
        enumerable: true,
        configurable: true
    });
    return TokenType;
})();
exports.TokenType = TokenType;
