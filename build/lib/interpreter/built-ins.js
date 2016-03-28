'use strict';
var fn_1 = require('./fn');
var types_1 = require('./types');
var primitive_1 = require('./primitive');
var types = require('./types');
function bindBuiltIns(scope) {
    set(scope, arithmetic('+', function (a, b) { return a + b; }));
    set(scope, arithmetic('-', function (a, b) { return a - b; }));
    set(scope, arithmetic('*', function (a, b) { return a * b; }));
    set(scope, arithmetic('/', function (a, b) { return a / b; }));
}
exports.bindBuiltIns = bindBuiltIns;
function set(scope, builder) {
    scope.set(builder.name, new fn_1.Fn(builder.fnType, builder.body));
}
function arithmetic(name, fn) {
    var numType = new types_1.TypeVar(types_1.Num);
    var fnType = types_1.FnType.build().takes(numType).takes(numType).returns(numType);
    return {
        name: name,
        fnType: fnType,
        body: function (scope, args) {
            if (args.length !== 2)
                throw new Error("TODO: remove me. " + name + " should be typechecked");
            var a = args[0];
            var b = args[1];
            if (a instanceof primitive_1.Primitive && b instanceof primitive_1.Primitive) {
                var aVal = a.value;
                var bVal = b.value;
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    // TODO: handle floats
                    var val = fn(a.value, b.value);
                    return new primitive_1.Primitive(types.Int32, val);
                }
                throw new Error("TODO: remove me. " + name + " should be typechecked");
            }
            throw new Error("TODO: remove me. " + name + " should be typechecked");
            return null;
        }
    };
}
