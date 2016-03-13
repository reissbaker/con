'use strict';
function regex(regexString) {
    var regex = new RegExp('^' + regexString + '$');
    return function (str) {
        return !!str.match(regex);
    };
}
exports.regex = regex;
function exact(str) {
    return function (inStr) {
        return str === inStr;
    };
}
exports.exact = exact;
function beginend(begin, end) {
    return function (inStr) {
        var begins = inStr.substr(0, begin.length) === begin;
        if (begins && inStr.length < begin.length + end.length)
            return true;
        var tail = inStr.substr(inStr.length - 1 - end.length, end.length);
        var ended = tail === end;
        return begins && !ended;
    };
}
exports.beginend = beginend;
