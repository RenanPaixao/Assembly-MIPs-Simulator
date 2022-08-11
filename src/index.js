var _a, _b, _c, _d, _e, _f, _g, _h;
// @ts-ignore
import hexToBinary from 'hex-to-binary';
import { readFileSync } from 'fs';
import { initializeRegisters, removeInvalidRegisters } from './utils/registers.js';
import { decodeInstruction } from './utils/instructions.js';
import { resetOutput, writeOutput } from './utils/jsonHandler.js';
var allRegisters = initializeRegisters();
var memory = {};
var text = {};
var data = {};
var add = readFileSync('./src/input/Add.input.json').toString();
var input = JSON.parse(add);
var output = {};
Object.keys(input).forEach(function (key) { var _a; return ((_a = input[key]) !== null && _a !== void 0 ? _a : (input[key] = {})); });
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
Object.entries((_e = input === null || input === void 0 ? void 0 : input.data) !== null && _e !== void 0 ? _e : {}).forEach(function (_a) {
    var key = _a[0], value = _a[1];
    data[key] = value;
});
text = (input === null || input === void 0 ? void 0 : input.text) ? input.text.map(function (value) {
    return hexToBinary(value.replace('0x', ''));
}) : {};
if (text === null || text === void 0 ? void 0 : text.length) {
    text.forEach(function (value, index) {
        var _a, _b, _c, _d;
        output.hex = input.text[index];
        output.text = (_a = decodeInstruction('00100010000100010000000000000100', allRegisters)) !== null && _a !== void 0 ? _a : {};
        output.regs = (_b = removeInvalidRegisters(allRegisters)) !== null && _b !== void 0 ? _b : {};
        output.mem = (_d = (_c = input.config) === null || _c === void 0 ? void 0 : _c.mem) !== null && _d !== void 0 ? _d : {};
        output.stdout = '';
        resetOutput(output);
        writeOutput('Add', output);
    });
}
else {
    output.regs = (_f = removeInvalidRegisters(allRegisters)) !== null && _f !== void 0 ? _f : {};
    output.mem = (_h = (_g = input.config) === null || _g === void 0 ? void 0 : _g.mem) !== null && _h !== void 0 ? _h : {};
    output.stdout = {};
    writeOutput('add', output);
}
//# sourceMappingURL=index.js.map