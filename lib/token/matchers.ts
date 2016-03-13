'use strict';

export function regex(regexString: string) {
  var regex = new RegExp('^' + regexString + '$');
  return function(str: string) {
    return !!str.match(regex);
  };
}

export function exact(str: string) {
  return function(inStr: string) {
    return str === inStr;
  };
}

export function beginend(begin: string, end: string) {
  return (inStr: string) => {
    const begins = inStr.substr(0, begin.length) === begin;
    if(begins && inStr.length < begin.length + end.length) return true;

    const tail = inStr.substr(inStr.length - 1 - end.length, end.length)
    const ended = tail === end;
    return begins && !ended;
  }
}
