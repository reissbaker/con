var token = require('./token');
function lex(source) {
    var tokens = parse(source);
    return tokens.filter(filterTypes([
        token.BlockComment,
        token.LineComment,
        token.Newline,
        token.Space,
    ]));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = lex;
function parse(line) {
    var lineNumber = 1;
    var tokens = [];
    var beginIndex = 0;
    var currentTokenType = null;
    var lastTokenType = null;
    var i = 1;
    for (i; i <= line.length; i++) {
        var substr = line.substring(beginIndex, i);
        currentTokenType = findValidTokenTypeFor(substr);
        if (currentTokenType) {
            lastTokenType = currentTokenType;
        }
        else {
            var prevSubstr_1 = line.substring(beginIndex, i - 1);
            if (!lastTokenType) {
                throw new Error(parseErrorString(lineNumber, substr));
            }
            tokens.push(lastTokenType.token(prevSubstr_1, lineNumber));
            if (lastTokenType === token.Newline)
                lineNumber++;
            beginIndex = i - 1;
            currentTokenType = findValidTokenTypeFor(line.substring(beginIndex, i));
            lastTokenType = currentTokenType;
        }
    }
    var prevSubstr = line.substring(beginIndex, i - 1);
    if (lastTokenType) {
        tokens.push(lastTokenType.token(prevSubstr, lineNumber));
    }
    else if (prevSubstr !== "") {
        throw new Error(parseErrorString(lineNumber, prevSubstr));
    }
    return tokens;
}
function and(predA, predB) {
    return function (x) { return predA(x) && predB(x); };
}
function filterTypes(types) {
    var firstFilter = filterType(types[0]);
    if (types.length === 1)
        return firstFilter;
    return and(firstFilter, filterTypes(types.slice(1)));
}
function filterType(tokenType) {
    return function (t) { return t.tokenType !== tokenType; };
}
function findValidTokenTypeFor(string) {
    for (var i = 0; i < token.allTypes.length; i++) {
        var tokenType = token.allTypes[i];
        if (tokenType.match(string))
            return tokenType;
    }
    return null;
}
function parseErrorString(line, string) {
    return "Unparseable string on line " + line + ": " + string;
}
