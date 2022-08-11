import { readdirSync, writeFileSync } from 'fs';
export function writeOutput(name, data) {
    writeFileSync("./src/output/".concat(name.replace('input', 'output')), JSON.stringify(data, null, 2), {});
}
export function resetOutput(data) {
    Object.keys(function (key) { return data[key] = {}; });
}
export function getFileNames() {
    return readdirSync('./src/input');
}
//# sourceMappingURL=jsonHandler.js.map