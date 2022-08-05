var instructionsOpCode = {
    '001000': 'addi',
    '001001': 'addiu',
    '001100': 'andi',
    '000111': 'bgtz',
    '000100': 'beq',
    '000001': 'bltz',
    '000110': 'blez',
    '000101': 'bne',
    '000010': 'j',
    '000011': 'jal',
    '100000': 'lb',
    '100100': 'lbu',
    '101111': 'lui',
    '100011': 'lw',
    '001101': 'ori',
    '101000': 'sb',
    '001010': 'slti',
    '101011': 'sw',
    '001110': 'xori',
    '000000': 'opZero' // opZero indicate instructions R type
};
function divInstructionI(instruction) {
    return {
        opCode: getOpCode(instruction),
        rs: instruction.substring(6, 11),
        rt: instruction.substring(11, 16),
        constant: instruction.substring(16, 32)
    };
}
var functions = {
    '100000': 'add',
    '100001': 'addu',
    '100100': 'and',
    '011010': 'div',
    '011011': 'divu',
    '001000': 'jr',
    '010000': 'mfhi',
    '010010': 'mflo',
    '0110000': 'mult',
    '011001': 'multu',
    '100111': 'nor',
    '100101': 'or',
    '000000': 'sll',
    '000100': 'sllv',
    '101010': 'slt',
    '000011': 'sra',
    '000111': 'srav',
    '000010': 'srl',
    '000110': 'srlv',
    '100010': 'sub',
    '100011': 'subu',
    '001100': 'syscall',
    '100110': 'xor',
};
function getOpCode(instruction) {
    return instruction.substring(0, 6);
}
function objectToDecimal(object) {
    // @ts-ignore
    var objectTransformedInEntries = Object.entries(object).map(function (_a) {
        var key = _a[0], value = _a[1];
        return [key, parseInt(value, 2)];
    });
    return Object.fromEntries(objectTransformedInEntries);
}
export function decodeInstruction(instruction) {
    var instructionName = instructionsOpCode[getOpCode(instruction)];
    if (getOpCode(instruction) !== '000000') {
        var instructionI = divInstructionI(instruction);
        switch (instructionI.opCode) {
            case '001000':
                return addi(instruction);
            default:
                console.log('------------------------------');
            // throw new Error('Instruction not found')
        }
    }
}
// Lembrar de usar o script antes de codar (yarn tsc:w)
// pra rodar o arquivo, verifica se o terminal tá na pasta raiz (Assembly-MIPs-Simulator-in-Node) e roda node src
//Criar funções de instruções que faltam
//Passo a passo pra testar
// 1. adiciona o case no switch da função decodeInstruction
// 2. a função decode instruction está sendo chamada dentro no index.ts
// 3. usa um console.log no index.ts usando a função com uma instrução qualquer
function addi(instruction) {
    var divInstruction = divInstructionI(instruction);
    var objectTransformed = objectToDecimal(divInstruction);
    return "".concat(instructionsOpCode[divInstruction.opCode], " $").concat(objectTransformed.rs, ", $").concat(objectTransformed.rt, ", ").concat(objectTransformed.constant);
}
//# sourceMappingURL=instructions.js.map