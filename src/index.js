var _a, _b, _c, _d, _e, _f;
import { initializeRegisters, removeInvalidRegisters } from './utils/registers.js';
import { decodeInstruction } from './utils/instructions.js';
// @ts-ignore
import hexToBinary from 'hex-to-binary';
import { readFileSync } from 'fs';
var allRegisters = initializeRegisters();
var memory = {};
var data = {};
var add = readFileSync('./src/input/Add.input.json').toString();
var input = JSON.parse(add);
var output = {};
/** --------------------------------------------------
 *
 * Initialize the registers, memory and data with the values from the input.
 *
 * ---------------------------------------------------**/
Object.entries((_b = (_a = input.config) === null || _a === void 0 ? void 0 : _a.regs) !== null && _b !== void 0 ? _b : {}).forEach(function (_a) {
    var key = _a[0], value = _a[1];
    allRegisters[key] = value;
});
Object.entries((_d = (_c = input.config) === null || _c === void 0 ? void 0 : _c.mem) !== null && _d !== void 0 ? _d : {}).forEach(function (_a) {
    var key = _a[0], value = _a[1];
    memory[key] = hexToBinary(value);
});
Object.entries((_f = (_e = input.data) === null || _e === void 0 ? void 0 : _e.data) !== null && _f !== void 0 ? _f : {}).forEach(function (_a) {
    var key = _a[0], value = _a[1];
    data[key] = value;
});
input.text = input.text.map(function (value) {
    return hexToBinary(value.replace('0x', ''));
});
console.log(removeInvalidRegisters(allRegisters));
/** -------------------------------------------------- **/
console.log(decodeInstruction('00100010000100010000000000000100', allRegisters));
console.log(decodeInstruction(testString('000000 10001 00001 00000 00000 100010'), allRegisters));
console.log('----------------------------------------------------');
console.log(removeInvalidRegisters(allRegisters));
function testString(str) {
    return str.replaceAll(' ', '');
}
//# sourceMappingURL=index.js.map