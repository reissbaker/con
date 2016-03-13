'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var intermediate_node_1 = require('./intermediate-node');
var RootNode = (function (_super) {
    __extends(RootNode, _super);
    function RootNode() {
        _super.call(this, 0);
    }
    RootNode.prototype.clone = function () {
        var root = new RootNode();
        root.addClonesOf(this.children);
        return root;
    };
    return RootNode;
})(intermediate_node_1.IntermediateNode);
exports.RootNode = RootNode;
