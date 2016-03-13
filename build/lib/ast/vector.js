'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var intermediate_node_1 = require('./intermediate-node');
var Vector = (function (_super) {
    __extends(Vector, _super);
    function Vector() {
        _super.apply(this, arguments);
    }
    Vector.prototype.clone = function () {
        var vector = new Vector(this.line);
        vector.addClonesOf(this.children);
        return vector;
    };
    return Vector;
})(intermediate_node_1.IntermediateNode);
exports.Vector = Vector;
