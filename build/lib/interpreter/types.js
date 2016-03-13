'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (PrimitiveType) {
    PrimitiveType[PrimitiveType["Null"] = 0] = "Null";
    PrimitiveType[PrimitiveType["Int32"] = 1] = "Int32";
    PrimitiveType[PrimitiveType["Float64"] = 2] = "Float64";
    PrimitiveType[PrimitiveType["Bool"] = 3] = "Bool";
    PrimitiveType[PrimitiveType["Byte"] = 4] = "Byte";
})(exports.PrimitiveType || (exports.PrimitiveType = {}));
var PrimitiveType = exports.PrimitiveType;
;
var StructureType = (function () {
    function StructureType(fields) {
        this._fields = {};
        for (var prop in fields) {
            if (fields.hasOwnProperty(prop)) {
                this._fields[prop] = fields[prop];
            }
        }
    }
    Object.defineProperty(StructureType.prototype, "fields", {
        get: function () {
            return this._fields;
        },
        enumerable: true,
        configurable: true
    });
    return StructureType;
})();
exports.StructureType = StructureType;
var FnType = (function (_super) {
    __extends(FnType, _super);
    function FnType(args, returnType) {
        _super.call(this, {
            length: PrimitiveType.Int32,
        });
        this._args = args;
        this._returnType = returnType;
    }
    Object.defineProperty(FnType.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FnType.prototype, "returnType", {
        get: function () {
            return this._returnType;
        },
        enumerable: true,
        configurable: true
    });
    return FnType;
})(StructureType);
exports.FnType = FnType;
var TaggedUnionType = (function (_super) {
    __extends(TaggedUnionType, _super);
    function TaggedUnionType(types) {
        // TODO: support transparent type intersection; e.g. if all types in the union have a "length"
        // field that is a Uint32, you should be able to call .length on the unioned type without having
        // to use a pattern match to split the types out.
        _super.call(this, {});
        this._types = types;
    }
    Object.defineProperty(TaggedUnionType.prototype, "types", {
        get: function () {
            return this._types;
        },
        enumerable: true,
        configurable: true
    });
    return TaggedUnionType;
})(StructureType);
exports.TaggedUnionType = TaggedUnionType;
