var _a, _b, _c, _d, _e;
import { initializeRegisters } from './utils/registers.js';
import { readFileSync } from 'fs';
var allRegisters = initializeRegisters();
var memory = {};
var data = {};
var add = readFileSync('./src/input/Add.input.json').toString();
var json = JSON.parse(add);
/** --------------------------------------------------
 *
 * Initialize the registers, memory and data with the values from the input.
 *
 * ---------------------------------------------------**/
Object.entries((_b = (_a = json.config) === null || _a === void 0 ? void 0 : _a.regs) !== null && _b !== void 0 ? _b : {}).forEach(function (_a) {
    var key = _a[0], value = _a[1];
    allRegisters[key] = value;
});
memory = (_d = (_c = json.config) === null || _c === void 0 ? void 0 : _c.mem) !== null && _d !== void 0 ? _d : {};
data = (_e = json.data) !== null && _e !== void 0 ? _e : {};
/** -------------------------------------------------- **/
//# sourceMappingURL=index.js.map