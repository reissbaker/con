'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var intermediate_node_1 = require('./intermediate-node');
var List = (function (_super) {
    __extends(List, _super);
    function List() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(List.prototype, "head", {
        get: function () {
            return this.children[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "rest", {
        get: function () {
            return this.children.slice(1);
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.clone = function () {
        var list = new List(this.line);
        list.addClonesOf(this.children);
        return list;
    };
    return List;
})(intermediate_node_1.IntermediateNode);
exports.List = List;
