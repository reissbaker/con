'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var intermediate_node_1 = require('./intermediate-node');
var Call = (function (_super) {
    __extends(Call, _super);
    function Call() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Call.prototype, "head", {
        get: function () {
            return this.children[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Call.prototype, "rest", {
        get: function () {
            return this.children.slice(1);
        },
        enumerable: true,
        configurable: true
    });
    Call.prototype.clone = function () {
        var call = new Call(this.line);
        call.addClonesOf(this.children);
        return call;
    };
    return Call;
})(intermediate_node_1.IntermediateNode);
exports.Call = Call;
