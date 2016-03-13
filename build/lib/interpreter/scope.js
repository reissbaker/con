'use strict';
// TODO: Make this class generic, so it can be reused for Ref node tracking for the compiler,
// tree-shaker, and unused value warning generator.
var ScopeTree = (function () {
    function ScopeTree() {
        this._parent = null;
        this._children = [];
        this._symbols = {};
    }
    ScopeTree.prototype.set = function (symbol, value) {
        this._symbols[symbol] = value;
        return value;
    };
    ScopeTree.prototype.lookup = function (symbol) {
        var value = this._symbols[symbol];
        if (value)
            return value;
        if (this._parent)
            return this._parent.lookup(symbol);
        return null;
    };
    ScopeTree.prototype.child = function () {
        var child = new ScopeTree();
        child._parent = this;
        this._children.push(child);
        return child;
    };
    return ScopeTree;
})();
exports.ScopeTree = ScopeTree;
