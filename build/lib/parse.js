'use strict';
var token = require('./token');
var root_node_1 = require('./ast/root-node');
var vector_1 = require('./ast/vector');
var list_1 = require('./ast/list');
var reference_1 = require('./ast/reference');
var constant_1 = require('./ast/constant');
var intRegex = /^(-)?\d+$/;
function parse(tokens) {
    var root = new root_node_1.RootNode();
    var current = root;
    var parenMatcher = new MatchCounter();
    var bracketMatcher = new MatchCounter();
    tokens.forEach(function (t) {
        if (t.tokenType === token.OpenParen) {
            current = current.addChild(new list_1.List(t.line));
            parenMatcher.open(t.line);
        }
        else if (t.tokenType === token.CloseParen) {
            current = current.parent;
            parenMatcher.close();
        }
        else if (t.tokenType === token.OpenBracket) {
            current = current.addChild(new vector_1.Vector(t.line));
            bracketMatcher.open(t.line);
        }
        else if (t.tokenType === token.CloseBracket) {
            current = current.parent;
            bracketMatcher.close();
        }
        else if (t.tokenType === token.Reference || t.tokenType === token.Operator) {
            if (t.source === "true") {
                current.addChild(new constant_1.Constant(t.line, constant_1.ConstantType.Bool, true));
            }
            else if (t.source === "false") {
                current.addChild(new constant_1.Constant(t.line, constant_1.ConstantType.Bool, false));
            }
            else {
                current.addChild(new reference_1.Reference(t.line, t.source));
            }
        }
        else if (t.tokenType === token.Num) {
            if (t.source.match(intRegex)) {
                current.addChild(new constant_1.Constant(t.line, constant_1.ConstantType.Int32, parseInt(t.source, 10)));
            }
            else {
                current.addChild(new constant_1.Constant(t.line, constant_1.ConstantType.Float64, parseFloat(t.source)));
            }
        }
        else {
            throw new Error('unknown token type');
        }
    });
    if (!parenMatcher.matched())
        throw new Error("Unmatched ( on line " + parenMatcher.lastLine);
    if (!bracketMatcher.matched())
        throw new Error("Unmatched [ on line " + parenMatcher.lastLine);
    return root;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parse;
var MatchCounter = (function () {
    function MatchCounter() {
        this._count = 0;
        this._lastLine = -1;
    }
    MatchCounter.prototype.open = function (line) {
        this._lastLine = line;
        this._count++;
    };
    MatchCounter.prototype.close = function () {
        this._count--;
    };
    MatchCounter.prototype.matched = function () {
        return this._count === 0;
    };
    Object.defineProperty(MatchCounter.prototype, "lastLine", {
        get: function () {
            return this._lastLine;
        },
        enumerable: true,
        configurable: true
    });
    return MatchCounter;
})();
