import { writeFileSync } from 'fs';
export function writeOutput(name, data) {
    console.log(data);
    writeFileSync("./src/output/".concat(name, ".output.json"), JSON.stringify(data, null, 2), {});
}
export function resetOutput(data) {
    Object.keys(function (key) { return data[key] = {}; });
}
//# sourceMappingURL=jsonHandler.js.map