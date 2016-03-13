'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var bodied_node_1 = require('./bodied-node');
var VarNode = (function (_super) {
    __extends(VarNode, _super);
    function VarNode() {
        _super.apply(this, arguments);
    }
    VarNode.prototype.clone = function () {
        return null;
    };
    return VarNode;
})(bodied_node_1.BodiedNode);
exports.VarNode = VarNode;
