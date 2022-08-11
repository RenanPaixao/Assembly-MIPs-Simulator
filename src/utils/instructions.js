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
    '011000': 'mult',
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
    '100110': 'xor', // nor
};
function divInstructionR(instruction) {
    return {
        opCode: getOpCode(instruction),
        rs: instruction.substring(6, 11),
        rt: instruction.substring(11, 16),
        rd: instruction.substring(16, 21),
        shift: instruction.substring(21, 26),
        opcodeExtension: instruction.substring(26, 32)
    };
}
var instructionsTypeJ = {
    '000010': 'j',
    '000011': 'jal'
};
function divInstructionJ(instruction) {
    return {
        opCode: getOpCode(instruction),
        jumpTargetAdsress: instruction.substring(6, 32)
    };
}
function checkOverflow(op, value1, value2) {
    var minValue = Number.MIN_VALUE;
    var maxValue = Number.MAX_VALUE;
    var cont1 = value1;
    var cont2 = value2;
    switch (op) {
        case '+':
            if ((cont1 + cont2) > maxValue || (cont1 + cont2) < minValue) {
                return true;
            }
            break;
        case '-':
            if ((cont1 - cont2) > maxValue || (cont1 - cont2) < minValue) {
                return true;
            }
            break;
        default:
            break;
    }
    return false;
}
function getOpCode(instruction) {
    return instruction.substring(0, 6);
}
function getOpcodeExtension(instruction) {
    return instruction.substring(26, 32);
}
function objectToDecimal(object) {
    // @ts-ignore
    var objectTransformedInEntries = Object.entries(object).map(function (_a) {
        var key = _a[0], value = _a[1];
        return [key, parseInt(value, 2)];
    });
    return Object.fromEntries(objectTransformedInEntries);
}
// pega os valores atuais dos registradores rs e rt
function getRsAndRtFromBinary(allRegisters, rs, rt) {
    return {
        rs: allRegisters["$".concat(rs)],
        rt: allRegisters["$".concat(rt)]
    };
}
function objectToDecimalR(object) {
    // @ts-ignore
    var objectTransformedInEntries = Object.entries(object).map(function (_a) {
        var key = _a[0], value = _a[1];
        return [key, parseInt(value, 2)];
    });
    return Object.fromEntries(objectTransformedInEntries);
}
function objectToDecimalJ(object) {
    // @ts-ignore
    var objectTransformedInEntries = Object.entries(object).map(function (_a) {
        var key = _a[0], value = _a[1];
        return [key, parseInt(value, 2)];
    });
    return Object.fromEntries(objectTransformedInEntries);
}
function applyOperationInRsRt(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    var rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt);
    var rdProperty = "$".concat(objectTransformed.rd);
    switch (divInstruction.opcodeExtension) {
        case '100100': //and
            allRegisters[rdProperty] = rsRt.rs & rsRt.rt;
            return "".concat(instructionsOpCode[divInstruction.opCode], " ").concat(rdProperty, ", $").concat(objectTransformed.rs, ", $").concat(objectTransformed.rt);
        case '100111': //nor
            allRegisters[rdProperty] = ~(rsRt.rs | rsRt.rt);
            return "".concat(instructionsOpCode[divInstruction.opCode], " ").concat(rdProperty, ", $").concat(objectTransformed.rs, ", $").concat(objectTransformed.rt);
        case '100101': //or
            allRegisters[rdProperty] = rsRt.rs | rsRt.rt;
            return "".concat(instructionsOpCode[divInstruction.opCode], " ").concat(rdProperty, ", $").concat(objectTransformed.rs, ", $").concat(objectTransformed.rt);
        case '100110': //xor
            allRegisters[rdProperty] = rsRt.rs ^ rsRt.rt;
            return "".concat(instructionsOpCode[divInstruction.opCode], " ").concat(rdProperty, ", $").concat(objectTransformed.rs, ", $").concat(objectTransformed.rt);
        default:
            return;
        // throw new Error('Operation Not Found')
    }
}
export function decodeInstruction(instruction, allRegisters) {
    applyOperationInRsRt(instruction, allRegisters);
    var instructionName = instructionsOpCode[getOpCode(instruction)];
    if (getOpCode(instruction) !== '000000') {
        var instructionI = divInstructionI(instruction);
        //Adiciona mais 4 para o pc, indicando uma instrução
        allRegisters.pc += 4;
        switch (instructionI.opCode) {
            case '001000':
                return addi(instruction, allRegisters);
            case '001001':
                return addiu(instruction, allRegisters);
            case '001100':
                return andi(instruction, allRegisters);
            default:
                console.log('------------------------------');
                allRegisters.pc -= 4;
                return;
            // throw new Error('Instruction not found')
        }
    }
    /*------------------------------------------------------------------------------------------------------------------*/
    var instructionR = divInstructionR(instruction);
    switch (instructionR.opcodeExtension) {
        case '100000':
            return add(instruction, allRegisters);
        case '100001':
            return addu(instruction, allRegisters);
        case '011010':
            return div(instruction, allRegisters);
        case '011011':
            return divu(instruction, allRegisters);
        case '100010':
            return sub(instruction, allRegisters);
        case '100011':
            return subu(instruction, allRegisters);
        case '011000':
            return mult(instruction, allRegisters);
        case '011001':
            return multu(instruction, allRegisters);
        case '010010':
            return mflo(instruction, allRegisters);
        case '010000':
            return mfhi(instruction, allRegisters);
        case '100100' || '100111' || '100101' || '100110':
            return applyOperationInRsRt(instruction, allRegisters);
        case '101010':
            return slt(instruction, allRegisters);
        case '000010':
            return srl(instruction, allRegisters);
        case '000110':
            return srlv(instruction, allRegisters);
        case '000100':
            return sllv(instruction, allRegisters);
        case '000000':
            return sll(instruction, allRegisters);
        default:
            allRegisters.pc -= 4;
            console.log('---------------------------');
        // throw new Error('Instruction not found!')
    }
    /* -----------------------------------------------------------------------------------------------------*/
    var instructionJ = divInstructionJ(instruction);
    switch (instructionJ.opCode) {
        case '000010':
            return j(instruction, allRegisters);
        case '000011':
            return jal(instruction, allRegisters);
        default:
    }
}
// Lembrar de usar o script antes de codar (yarn tsc:w)
// pra rodar o arquivo, verifica se o terminal tá na pasta raiz (Assembly-MIPs-Simulator-in-Node) e roda node src
//Criar funções de instruções que faltam
//Passo a passo pra testar
// 1. adiciona o case no switch da função decodeInstruction
// 2. a função decode instruction está sendo chamada dentro no index.ts
// 3. usa um console.log no index.ts usando a função com uma instrução qualquer
/**
 * Update a register with operation result and returns a parsed instruction
 */
//Funções para as instruções tipo I
function addi(instruction, allRegisters) {
    var divInstruction = divInstructionI(instruction);
    var objectTransformed = objectToDecimal(divInstruction);
    //Precisa adicionar a checagem de overflow
    var operationResult = allRegisters["$".concat(objectTransformed.rs)] + objectTransformed.constant;
    allRegisters["$".concat(objectTransformed.rt)] = operationResult;
    return "".concat(instructionsOpCode[divInstruction.opCode], " $").concat(objectTransformed.rt, ", $").concat(objectTransformed.rs, ", ").concat(objectTransformed.constant);
}
function addiu(instruction, allRegisters) {
    var divInstruction = divInstructionI(instruction);
    var objectTransformed = objectToDecimal(divInstruction);
    var operationResult = allRegisters["$".concat(objectTransformed.rs)] + objectTransformed.constant;
    allRegisters["$".concat(objectTransformed.rt)] = operationResult;
    return "".concat(instructionsOpCode[divInstruction.opCode], " $").concat(objectTransformed.rt, ", $").concat(objectTransformed.rs, ", ").concat(objectTransformed.constant);
}
function andi(instruction, allRegisters) {
    var divInstruction = divInstructionI(instruction);
    //const objectTransformed = objectToDecimal(divInstruction)
}
/* ----------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
------------------------------------------------------------------------------------- */
//Funções para as instruções tipo R
function add(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    //Precisa adicionar a checagem de overflow
    var operationResult = allRegisters["$".concat(objectTransformed.rs)] + allRegisters["$".concat(objectTransformed.rt)];
    allRegisters["$".concat(objectTransformed.rd)] = operationResult;
    return "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rd, ", $").concat(objectTransformed.rs, ", $").concat(objectTransformed.rt);
}
function addu(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    var operationResult = allRegisters["$".concat(objectTransformed.rs)] + allRegisters["$".concat(objectTransformed.rt)];
    allRegisters["$".concat(objectTransformed.rd)] = operationResult;
    return "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rd, ", $").concat(objectTransformed.rs, ", $").concat(objectTransformed.rt);
}
function div(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimal(divInstruction);
    var parsedInstruction = "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rs, ", $").concat(objectTransformed.rt);
    // Rejeitando divisão por zero
    if (!objectTransformed.rs || !objectTransformed.rt) {
        allRegisters.lo = 0;
        allRegisters.hi = 0;
        return parsedInstruction;
    }
    var rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt);
    var loResult = Math.floor(rsRt.rs / rsRt.rt);
    var hiResult = rsRt.rs % rsRt.rt;
    allRegisters.lo = loResult;
    allRegisters.hi = hiResult;
    return parsedInstruction;
}
function divu(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimal(divInstruction);
    var parsedInstruction = "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rs, ", $").concat(objectTransformed.rt);
    // Rejeitando divisão por zero
    if (!objectTransformed.rs || !objectTransformed.rt) {
        allRegisters.lo = 0;
        allRegisters.hi = 0;
        return parsedInstruction;
    }
    var rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt);
    var loResult = Math.floor(rsRt.rs / rsRt.rt);
    var hiResult = rsRt.rs % rsRt.rt;
    allRegisters.lo = loResult;
    allRegisters.hi = hiResult;
    return parsedInstruction;
}
function sub(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    //Precisa adicionar a checagem de overflow
    var operationResult = allRegisters["$".concat(objectTransformed.rs)] - allRegisters["$".concat(objectTransformed.rt)];
    allRegisters["$".concat(objectTransformed.rd)] = operationResult;
    return "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rd, ", $").concat(objectTransformed.rs, ", $").concat(objectTransformed.rt);
}
function subu(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    var operationResult = allRegisters["$".concat(objectTransformed.rs)] - allRegisters["$".concat(objectTransformed.rt)];
    allRegisters["$".concat(objectTransformed.rd)] = operationResult;
    return "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rd, ", $").concat(objectTransformed.rs, ", $").concat(objectTransformed.rt);
}
function mult(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    var rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt);
    var loResult = Math.floor(rsRt.rs * rsRt.rt);
    var hiResult = rsRt.rs % rsRt.rt;
    //Precisa adicionar a condição de overflow
    allRegisters.lo = loResult;
    allRegisters.hi = hiResult;
    return "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rs, ", $").concat(objectTransformed.rt);
}
function multu(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    var rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt);
    var loResult = Math.floor(rsRt.rs * rsRt.rt);
    var hiResult = rsRt.rs % rsRt.rt;
    //Precisa adicionar a condição de overflow
    allRegisters.lo = loResult;
    allRegisters.hi = hiResult;
    return "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rs, ", $").concat(objectTransformed.rt);
}
function mflo(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    allRegisters["$".concat(objectTransformed.rd)] = allRegisters.lo;
    return "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rd);
}
function mfhi(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    allRegisters["$".concat(objectTransformed.rd)] = allRegisters.hi;
    return "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rd);
}
function slt(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    var rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt);
    allRegisters["$".concat(objectTransformed.rd)] = rsRt.rs < rsRt.rt ? 1 : 0;
    return "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rd, ", $").concat(objectTransformed.rs, ", $").concat(objectTransformed.rt);
}
function sll(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    var rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt);
    allRegisters["$".concat(objectTransformed.rd)] = rsRt.rt * Math.pow(2, objectTransformed.shift);
    return "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rd, ", $").concat(objectTransformed.rt, ", ").concat(objectTransformed.shift, ",");
}
function srl(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    var rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt);
    allRegisters["$".concat(objectTransformed.rd)] = rsRt.rt * Math.pow(2, (-1) * objectTransformed.shift);
    return "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rd, ", $").concat(objectTransformed.rt, ", ").concat(objectTransformed.shift, ",");
}
function sllv(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    var rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt);
    allRegisters["$".concat(objectTransformed.rd)] = rsRt.rt << objectTransformed.rs;
    return "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rd, ", $").concat(objectTransformed.rt, ", $").concat(objectTransformed.rs, ",");
}
function srlv(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    var rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt);
    allRegisters["$".concat(objectTransformed.rd)] = rsRt.rt >> objectTransformed.rs;
    return "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rd, ", $").concat(objectTransformed.rt, ", $").concat(objectTransformed.rs, ",");
}
function sra(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    var rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt);
    allRegisters["$".concat(objectTransformed.rd)] = rsRt.rt >> objectTransformed.shift;
    return "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rd, ", $").concat(objectTransformed.rt, ", ").concat(objectTransformed.shift, ",");
}
function srav(instruction, allRegisters) {
    var divInstruction = divInstructionR(instruction);
    var objectTransformed = objectToDecimalR(divInstruction);
    var rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt);
    allRegisters["$".concat(objectTransformed.rd)] = rsRt.rt >> objectTransformed.rs;
    return "".concat(functions[divInstruction.opcodeExtension], " $").concat(objectTransformed.rd, ", $").concat(objectTransformed.rt, ", ").concat(objectTransformed.rs, ",");
}
/*----------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------*/
//Intruções Tipo J
function j(instruction, allRegisters) {
    var divInstruction = divInstructionJ(instruction);
    var objectTransformed = objectToDecimalJ(divInstruction);
    allRegisters.pc = objectTransformed.jumpTargetAddress * 4;
    return "".concat(functions[divInstruction.opCode], " ").concat(objectTransformed.jumpTargetAddress);
}
function jal(instruction, allRegisters) {
    var divInstruction = divInstructionJ(instruction);
    var objectTransformed = objectToDecimalJ(divInstruction);
    allRegisters.$31 = allRegisters.pc;
    allRegisters.pc = objectTransformed.jumpTargetAddress * 4;
    return "".concat(functions[divInstruction.opCode], " ").concat(objectTransformed.jumpTargetAddress);
}
//# sourceMappingURL=instructions.js.map