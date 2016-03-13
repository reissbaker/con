'use strict';
var token_type_1 = require('./token-type');
var matchers = require('./matchers');
var token_type_2 = require('./token-type');
exports.TokenType = token_type_2.TokenType;
exports.allTypes = [];
function def(typedef) {
    var tokenType = new token_type_1.TokenType(typedef);
    exports.allTypes.push(tokenType);
    return tokenType;
}
exports.BlockComment = def({
    name: "BlockComment",
    match: matchers.beginend(";*", "*;"),
});
exports.LineComment = def({
    name: "LineComment",
    match: matchers.regex(";[^\\n\\*]*"),
    validate: function (str) {
        return str.length > 1 && str[1] == ";";
    }
});
exports.Newline = def({
    name: "Newline",
    match: matchers.exact("\n"),
});
exports.Space = def({
    name: "Space",
    match: matchers.regex(" +"),
});
exports.OpenParen = def({
    name: "OpenParen",
    match: matchers.exact("("),
});
exports.CloseParen = def({
    name: "CloseParen",
    match: matchers.exact(")"),
});
exports.OpenBracket = def({
    name: "OpenBracket",
    match: matchers.exact("["),
});
exports.CloseBracket = def({
    name: "CloseBracket",
    match: matchers.exact("]"),
});
exports.Reference = def({
    name: "Reference",
    match: matchers.regex("([a-z]|-|_|[A-Z])+([!|\\?])?"),
});
var numericRegex = /^(-)?\d+(\.\d+)?$/;
exports.Num = def({
    name: "Num",
    match: matchers.regex("(-)?\\d+(\\.\\d*)?"),
    validate: function (str) {
        return !!str.match(numericRegex);
    },
});
exports.Operator = def({
    name: "Operator",
    match: matchers.regex("(\\+|-|\\*|/|=|!|!=|&&|\\|\\||\\||&|>|<|<=|>=|>>|<<)"),
});
var CONTENT_TYPES = [
    exports.Reference,
    exports.Num,
    exports.Operator,
];
function prettyString(tokens) {
    var pieces = [];
    tokens.forEach(function (token) {
        if (CONTENT_TYPES.indexOf(token.tokenType) >= 0) {
            pieces.push(token.tokenType.typeName + "(" + token.source + ")");
        }
        else {
            pieces.push(token.tokenType.typeName);
        }
    });
    return pieces.join(" ");
}
exports.prettyString = prettyString;
