'use strict';
var NominalType = (function () {
    function NominalType(name, fields) {
        this._fields = {};
        this._name = name;
        for (var prop in fields) {
            if (fields.hasOwnProperty(prop)) {
                this._fields[prop] = fields[prop];
            }
        }
    }
    Object.defineProperty(NominalType.prototype, "typeName", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NominalType.prototype, "fields", {
        get: function () {
            return this._fields;
        },
        enumerable: true,
        configurable: true
    });
    return NominalType;
})();
exports.NominalType = NominalType;
exports.Null = new NominalType('Null', {});
exports.Int32 = new NominalType('Int32', {});
exports.Float64 = new NominalType('Float64', {});
exports.Bool = new NominalType('Bool', {});
exports.Byte = new NominalType('Byte', {});
var UnionType = (function () {
    function UnionType(types) {
        this._types = types;
    }
    Object.defineProperty(UnionType.prototype, "types", {
        get: function () {
            return this._types;
        },
        enumerable: true,
        configurable: true
    });
    return UnionType;
})();
exports.UnionType = UnionType;
exports.Num = new UnionType([exports.Int32, exports.Float64]);
var IntersectionType = (function () {
    function IntersectionType(types) {
        this._types = types;
    }
    Object.defineProperty(IntersectionType.prototype, "types", {
        get: function () {
            return this._types;
        },
        enumerable: true,
        configurable: true
    });
    return IntersectionType;
})();
exports.IntersectionType = IntersectionType;
var TypeVar = (function () {
    function TypeVar(constraint) {
        this._constraint = constraint;
    }
    Object.defineProperty(TypeVar.prototype, "constraint", {
        get: function () {
            return this._constraint;
        },
        enumerable: true,
        configurable: true
    });
    return TypeVar;
})();
exports.TypeVar = TypeVar;
var FnTypeBuilder = (function () {
    function FnTypeBuilder() {
        this._args = [];
    }
    FnTypeBuilder.prototype.takes = function (tVar) {
        this._args.push(tVar);
        return this;
    };
    FnTypeBuilder.prototype.returns = function (tVar) {
        this.takes(tVar);
        return this._done();
    };
    FnTypeBuilder.prototype._done = function () {
        var numArgs = this._args.length;
        var current = {
            argType: this._args[numArgs - 2],
            next: this._args[numArgs - 1],
        };
        for (var i = this._args.length - 3; i >= 0; i--) {
            current = {
                argType: this._args[i],
                next: current,
            };
        }
        return new FnType(current);
    };
    return FnTypeBuilder;
})();
exports.FnTypeBuilder = FnTypeBuilder;
var FnType = (function () {
    function FnType(defn) {
        this._defn = defn;
    }
    Object.defineProperty(FnType.prototype, "definition", {
        get: function () {
            return this._defn;
        },
        enumerable: true,
        configurable: true
    });
    FnType.build = function () {
        return new FnTypeBuilder();
    };
    return FnType;
})();
exports.FnType = FnType;
var LambdaDeltaType = (function () {
    function LambdaDeltaType() {
    }
    return LambdaDeltaType;
})();
exports.LambdaDeltaType = LambdaDeltaType;
