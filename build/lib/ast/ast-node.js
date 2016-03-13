'use strict';
var AstNode = (function () {
    function AstNode(line) {
        this._line = line;
    }
    Object.defineProperty(AstNode.prototype, "line", {
        get: function () {
            return this._line;
        },
        enumerable: true,
        configurable: true
    });
    return AstNode;
})();
exports.AstNode = AstNode;
