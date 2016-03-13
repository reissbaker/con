'use strict';
var fn_1 = require('./fn');
var types_1 = require('./types');
var primitive_1 = require('./primitive');
var types = require('./types');
function bindBuiltIns(scope) {
    set(scope, {
        name: '+',
        argTypes: [],
        returnType: null,
        body: function (scope, args) {
            if (args.length !== 2)
                throw new Error("TODO: remove me. + should be typechecked");
            var a = args[0];
            var b = args[1];
            if (a instanceof primitive_1.Primitive && b instanceof primitive_1.Primitive) {
                var aVal = a.value;
                var bVal = b.value;
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    // TODO: handle floats
                    return new primitive_1.Primitive(types.PrimitiveType.Int32, aVal + bVal);
                }
                throw new Error("TODO: remove me. + should be typechecked");
            }
            throw new Error("TODO: remove me. + should be typechecked");
            return null;
        },
    });
}
exports.bindBuiltIns = bindBuiltIns;
function set(scope, builder) {
    var fnType = new types_1.FnType(builder.argTypes, builder.returnType);
    scope.set(builder.name, new fn_1.Fn(fnType, builder.body));
}
