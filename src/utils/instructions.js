var instructionsOpCode = {
    '001000': 'addi',
    '001001': 'addiu',
    '001100': 'andi',
    '000111': 'bgtz',
    '000100': 'beq',
    '000001': 'bltz',
    '000110': 'blez',
    '000101': 'bne',
    '100000': 'lb',
    '100100': 'lbu',
    '101111': 'lui',
    '100011': 'lw',
    '001101': 'ori',
    '101000': 'sb',
    '001010': 'slti',
    '101011': 'sw',
    '001110': 'xori' //done
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
var overflowMsg = 'Overflow';
function checkOverflow(op, value1, value2) {
    var minValue = Number.MIN_VALUE;
    var maxValue = Number.MAX_VALUE;
    var cont1 = value1;
    var cont2 = value2;
    switch (op) {
        case '100000':
            if ((cont1 + cont2) > maxValue || (cont1 + cont2) < minValue) {
                return true;
            }
            break;
        case '100010':
            if ((cont1 - cont2) > maxValue || (cont1 - cont2) < minValue) {
                return true;
            }
            break;
        case '001000':
            if ((cont1 + cont2) > maxValue || (cont1 + cont2) < minValue) {
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
export function decodeInstruction(instruction, allRegisters, output) {
    applyOperationInRsRt(instruction, allRegisters);
    var instructionName = instructionsOpCode[getOpCode(instruction)];
    if (getOpCode(instruction) !== '000000') {
        var instructionI = divInstructionI(instruction);
        //Adiciona mais 4 para o pc, indicando uma instrução
        allRegisters.pc += 4;
        switch (instructionI.opCode) {
            case '001000':
                try {
                    return andi(instruction, allRegisters);
                }
                catch (error) {
                    //@ts-ignore
                    console.log(error.message);
                    //@ts-ignore
                    output.stdout = error.message;
                }
                break;
            case '001001':
                return addiu(instruction, allRegisters);
            case '001100':
                return andi(instruction, allRegisters);
            case '000100':
                return beq(instruction, allRegisters);
            case '000101':
                return bne(instruction, allRegisters);
            case '000001':
                return bltz(instruction, allRegisters);
            case '000110':
                return blez(instruction, allRegisters);
            case '000111':
                return bgtz(instruction, allRegisters);
            case '001010':
                return slti(instruction, allRegisters);
            case '001101':
                return ori(instruction, allRegisters);
            case '001110':
                return xori(instruction, allRegisters);
            default:
                allRegisters.pc -= 4;
                console.log('instrução não encontrada');
                return;
        }
    }
    /* -----------------------------------------------------------------------------------------------------*/
    if (getOpCode(instruction) === '000010' || getOpCode(instruction) === '000011') {
        var instructionJ = divInstructionJ(instruction);
        switch (instructionJ.opCode) {
            case '000010':
                return j(instruction, allRegisters);
            case '000011':
                return jal(instruction, allRegisters);
            default:
                allRegisters.pc -= 4;
                console.log('instrução não encontrada');
                return;
        }
    }
    /*------------------------------------------------------------------------------------------------------------------*/
    var instructionR = divInstructionR(instruction);
    switch (instructionR.opcodeExtension) {
        case '100000':
            try {
                return add(instruction, allRegisters);
            }
            catch (error) {
                //@ts-ignore
                console.log(error.message);
                //@ts-ignore
                output.stdout = error.message;
            }
            break;
        case '100001':
            return addu(instruction, allRegisters);
        case '011010':
            return div(instruction, allRegisters);
        case '011011':
            return divu(instruction, allRegisters);
        case '100010':
            try {
                return sub(instruction, allRegisters);
            }
            catch (error) {
                //@ts-ignore
                console.log(error.message);
                //@ts-ignore
                output.stdout = error.message;
            }
            break;
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
            console.log('instrução não encontrada');
    }
}
// Lembrar de usar o script antes de codar (yarn tsc:w)
/* ---------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------*/
//Funções para as instruções tipo I
function addi(instruction, allRegisters) {
    var divInstruction = divInstructionI(instruction);
    var objectTransformed = objectToDecimal(divInstruction);
    //Checagem de overflow
    if (checkOverflow(divInstruction.opCode, allRegisters["$".concat(objectTransformed.rs)], objectTransformed.constant)) {
        throw new Error(overflowMsg);
    }
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
    var objectTransformed = objectToDecimal(divInstruction);
    var rsProperty = "$".concat(objectTransformed.rs);
    allRegisters[rsProperty] = allRegisters["$".concat(objectTransformed.rt)] & objectTransformed.constant;
    return "".concat(instructionsOpCode[divInstruction.opCode], " ").concat(rsProperty, ", $").concat(objectTransformed.rt, ", ").concat(objectTransformed.constant);
}
function beq(instruction, allRegisters) {
    var divInstruction = divInstructionI(instruction);
    var objectTransformed = objectToDecimal(divInstruction);
    if (allRegisters["$".concat(objectTransformed.rs)] == allRegisters["$".concat(objectTransformed.rt)]) {
        allRegisters.pc += (objectTransformed.constant * 4);
        allRegisters.pc -= 4;
    }
}
function bne(instruction, allRegisters) {
    var divInstruction = divInstructionI(instruction);
    var objectTransformed = objectToDecimal(divInstruction);
    if (allRegisters["$".concat(objectTransformed.rs)] != allRegisters["$".concat(objectTransformed.rt)]) {
        allRegisters.pc += (objectTransformed.constant * 4);
        allRegisters.pc -= 4;
    }
}
function bltz(instruction, allRegisters) {
    var divInstruction = divInstructionI(instruction);
    var objectTransformed = objectToDecimal(divInstruction);
    if (allRegisters["$".concat(objectTransformed.rs)] < 0) {
        allRegisters.pc += (objectTransformed.constant * 4);
        allRegisters.pc -= 4;
    }
}
function blez(instruction, allRegisters) {
    var divInstruction = divInstructionI(instruction);
    var objectTransformed = objectToDecimal(divInstruction);
    if (allRegisters["$".concat(objectTransformed.rs)] <= 0) {
        allRegisters.pc += (objectTransformed.constant * 4);
        allRegisters.pc -= 4;
    }
}
function bgtz(instruction, allRegisters) {
    var divInstruction = divInstructionI(instruction);
    var objectTransformed = objectToDecimal(divInstruction);
    if (allRegisters["$".concat(objectTransformed.rs)] > 0) {
        allRegisters.pc += (objectTransformed.constant * 4);
        allRegisters.pc -= 4;
    }
}
function slti(instruction, allRegisters) {
    var divInstruction = divInstructionI(instruction);
    var objectTransformed = objectToDecimal(divInstruction);
    var rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt);
    allRegisters["$".concat(objectTransformed.rs)] = rsRt.rt < objectTransformed.constant ? 1 : 0;
    return "".concat(functions[divInstruction.opCode], " $").concat(objectTransformed.rs, ", $").concat(objectTransformed.rt, ", ").concat(objectTransformed.constant);
}
function ori(instruction, allRegisters) {
    var divInstruction = divInstructionI(instruction);
    var objectTransformed = objectToDecimal(divInstruction);
    var rsProperty = "$".concat(objectTransformed.rs);
    allRegisters[rsProperty] = allRegisters["$".concat(objectTransformed.rt)] | objectTransformed.constant;
    return "".concat(instructionsOpCode[divInstruction.opCode], " ").concat(rsProperty, ", $").concat(objectTransformed.rt, ", ").concat(objectTransformed.constant);
}
function xori(instruction, allRegisters) {
    var divInstruction = divInstructionI(instruction);
    var objectTransformed = objectToDecimal(divInstruction);
    var rsProperty = "$".concat(objectTransformed.rs);
    allRegisters[rsProperty] = allRegisters["$".concat(objectTransformed.rt)] ^ objectTransformed.constant;
    return "".concat(instructionsOpCode[divInstruction.opCode], " ").concat(rsProperty, ", $").concat(objectTransformed.rt, ", ").concat(objectTransformed.constant);
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
    //Checagem de overflow
    if (checkOverflow(divInstruction.opcodeExtension, allRegisters["$".concat(objectTransformed.rs)], allRegisters["$".concat(objectTransformed.rt)])) {
        throw new Error(overflowMsg);
    }
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
    //Checagem de Overflow
    if (checkOverflow(divInstruction.opcodeExtension, allRegisters["$".concat(objectTransformed.rs)], allRegisters["$".concat(objectTransformed.rt)])) {
        throw new Error(overflowMsg);
    }
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