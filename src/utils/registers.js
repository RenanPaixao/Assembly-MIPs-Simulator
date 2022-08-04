var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/** Create all numeric registers and no numeric also as entries to create an object to manipulate them.
 * These registers are with 0 as value.
 */
export function initializeRegisters() {
    var numericRegisters = Array(32).fill(0).map(function (_, i) { return ["$".concat(i), 0]; });
    var nonNumericRegisters = [['pc', 0], ['hi', 0], ['lo', 0]];
    var registers = Object.fromEntries(__spreadArray(__spreadArray([], numericRegisters, true), nonNumericRegisters, true));
    /** Add values different from 0 to the registers that need it. **/
    registers.$28 = 268468224;
    registers.$29 = 2147479548;
    registers.lo = 4194304;
    return registers;
}
export function removeInvalidRegisters(registers) {
    var localRegisters = __assign({}, registers);
    Object.entries(localRegisters).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        value === 0 && delete localRegisters[key];
    });
    return localRegisters;
}
//# sourceMappingURL=registers.js.map