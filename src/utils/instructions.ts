const instructionsOpCode = {
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
	'001110': 'xori'
}

function divInstructionI(instruction: string) {
	return {
		opCode: getOpCode(instruction),
		rs: instruction.substring(6, 11),
		rt: instruction.substring(11, 16),
		constant: instruction.substring(16, 32)
	}
}


const functions = {
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
}

function divInstructionR(instruction: string) {
	return {
		opCode: getOpCode(instruction),
		rs: instruction.substring(6, 11),
		rt: instruction.substring(11, 16),
		rd: instruction.substring(16, 21),
		shift: instruction.substring(21, 26),
		opcodeExtension: instruction.substring(26, 32)
	}
}

const instructionsTypeJ = {
	'000010': 'j',
	'000011': 'jal'
}

function divInstructionJ(instruction: string) {
	return {
		opCode: getOpCode(instruction),
		jumpTargetAddress: instruction.substring(6, 32)
	}
}

const overflowMsg = 'Overflow'

function checkOverflow(op: string, value1: number, value2: number) {

	let minValue = Number.MIN_VALUE
	let maxValue = Number.MAX_VALUE
	let cont1 = value1
	let cont2 = value2

	switch (op) {
		case '100000':
			if ((cont1 + cont2) > maxValue || (cont1 + cont2) < minValue) {
				return true
			}
			break
		case '100010':
			if ((cont1 - cont2) > maxValue || (cont1 - cont2) < minValue) {
				return true
			}
			break
		case '001000':
			if ((cont1 + cont2) > maxValue || (cont1 + cont2) < minValue) {
				return true
			}
			break
		default:
			break
	}

	return false
}

function getOpCode(instruction: string) {
	return instruction.substring(0, 6)
}

function getOpcodeExtension(instruction: string) {
	return instruction.substring(26, 32)
}

function objectToDecimal(object: any): { opcode: number, rs: number, rt: number, constant: number } {
	// @ts-ignore
	const objectTransformedInEntries = Object.entries(object).map(([key, value]) => [key, parseInt(value, 2)])

	return Object.fromEntries(objectTransformedInEntries)
}

// pega os valores atuais dos registradores rs e rt
function getRsAndRtFromBinary(allRegisters: Record<string, any>, rs: string | number, rt: string | number): { rs: number, rt: number } {
	return {
		rs: allRegisters[`$${rs}`],
		rt: allRegisters[`$${rt}`]
	}
}

function objectToDecimalR(object: any): { opcode: number, rs: number, rt: number, rd: number, shift: number, constant: number } {
	// @ts-ignore
	const objectTransformedInEntries = Object.entries(object).map(([key, value]) => [key, parseInt(value, 2)])

	return Object.fromEntries(objectTransformedInEntries)
}

function objectToDecimalJ(object: any): { opcode: number, jumpTargetAddress: number } {
	// @ts-ignore
	const objectTransformedInEntries = Object.entries(object).map(([key, value]) => [key, parseInt(value, 2)])

	return Object.fromEntries(objectTransformedInEntries)
}

function applyOperationInRsRt(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)
	const rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt)
	const rdProperty = `$${objectTransformed.rd}`

	switch (divInstruction.opcodeExtension) {
		case '100100': //and
			allRegisters[rdProperty] = rsRt.rs & rsRt.rt
			return `${instructionsOpCode[divInstruction.opCode]} ${rdProperty}, $${objectTransformed.rs}, $${objectTransformed.rt}`
		case '100111': //nor
			allRegisters[rdProperty] = ~(rsRt.rs | rsRt.rt)
			return `${instructionsOpCode[divInstruction.opCode]} ${rdProperty}, $${objectTransformed.rs}, $${objectTransformed.rt}`
		case '100101': //or
			allRegisters[rdProperty] = rsRt.rs | rsRt.rt
			return `${instructionsOpCode[divInstruction.opCode]} ${rdProperty}, $${objectTransformed.rs}, $${objectTransformed.rt}`
		case '100110': //xor
			allRegisters[rdProperty] = rsRt.rs ^ rsRt.rt
			return `${instructionsOpCode[divInstruction.opCode]} ${rdProperty}, $${objectTransformed.rs}, $${objectTransformed.rt}`
		default:
			console.log('Operation Not Found')
			return
	}
}

export function decodeInstruction(instruction: string, allRegisters: Record<string, any>, output: any, memory: any) {
	const instructionName = instructionsOpCode[getOpCode(instruction)]

	if (getOpCode(instruction) !== '000000') {
		const instructionI = divInstructionI(instruction)

		//Adiciona mais 4 para o pc, indicando uma instrução
		allRegisters.pc += 4

		switch (instructionI.opCode) {
			case '001000':
				try {
					return addi(instruction, allRegisters)
				} catch (error) {
					//@ts-ignore
					console.log(error.message)
	
					//@ts-ignore
					output.stdout = error.message
				}
				break
			case '001001':
				return addiu(instruction, allRegisters)
			case '001100':
				return andi(instruction, allRegisters)
			case '000100':
				return beq(instruction, allRegisters)
			case '000101':
				return bne(instruction, allRegisters)
			case '000001':
				return bltz(instruction, allRegisters)
			case '000110':
				return blez(instruction, allRegisters)
			case '000111':
				return bgtz(instruction, allRegisters)
			case '001010':
				return slti(instruction, allRegisters)
			case '001101':
				return ori(instruction, allRegisters)
			case '001110':
				return xori(instruction, allRegisters)
			case '100000':
				return lb(instruction, allRegisters, memory)
			case '100100':
				return lbu(instruction, allRegisters, memory)
			case '100011':
				return lw(instruction, allRegisters, memory)
			case '101111':
				return lui(instruction, allRegisters, memory)
			case '101011':
				return sw(instruction, allRegisters, memory)
			case '101000':
				return sb(instruction, allRegisters, memory)
			default:
				allRegisters.pc -= 4
				console.log('instrução não encontrada')
				return
		}
	}

	/* -----------------------------------------------------------------------------------------------------*/
	if(getOpCode(instruction) === '000010' || getOpCode(instruction) === '000011') {
		
		const instructionJ = divInstructionJ(instruction)
		
		switch(instructionJ.opCode) {
			case '000010':
				return j(instruction, allRegisters)
			case '000011':
				return jal(instruction, allRegisters)
			default:
				allRegisters.pc -= 4
				console.log('instrução não encontrada')
				return
		}
	}

	/*------------------------------------------------------------------------------------------------------------------*/
	const instructionR = divInstructionR(instruction)

	switch (instructionR.opcodeExtension) {
		case '100000':
			try {
				return add(instruction, allRegisters)
			} catch (error) {
				//@ts-ignore
				console.log(error.message)

				//@ts-ignore
				output.stdout = error.message
			}
			break
		case '100001':
			return addu(instruction, allRegisters)
		case '011010':
			return div(instruction, allRegisters)
		case '011011':
			return divu(instruction, allRegisters)
		case '100010':
			try {
				return sub(instruction, allRegisters)
			} catch (error) {
				//@ts-ignore
				console.log(error.message)

				//@ts-ignore
				output.stdout = error.message
			}
			break
		case '100011':
			return subu(instruction, allRegisters)
		case '011000':
			return mult(instruction, allRegisters)
		case '011001':
			return multu(instruction, allRegisters)
		case '010010':
			return mflo(instruction, allRegisters)
		case '010000':
			return mfhi(instruction, allRegisters)
		case '100100' || '100111' || '100101' || '100110':
			return applyOperationInRsRt(instruction, allRegisters)
		case '101010':
			return slt(instruction, allRegisters)
		case '000010':
			return srl(instruction, allRegisters)
		case '000110':
			return srlv(instruction, allRegisters)
		case '000100':
			return sllv(instruction, allRegisters)
		case '000000':
			return sll(instruction, allRegisters)
		default:
			allRegisters.pc -= 4
			console.log('instrução não encontrada')
	}
}

/* ---------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------*/

//Funções para as instruções tipo I

function addi(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)

	//Checagem de overflow
	if (checkOverflow(divInstruction.opCode, allRegisters[`$${objectTransformed.rs}`], objectTransformed.constant)) {
		throw new Error(overflowMsg)
	}

	const operationResult = allRegisters[`$${objectTransformed.rs}`] + objectTransformed.constant

	allRegisters[`$${objectTransformed.rt}`] = operationResult

	return `${instructionsOpCode[divInstruction.opCode]} $${objectTransformed.rt}, $${objectTransformed.rs}, ${objectTransformed.constant}`
}

function addiu(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)

	const operationResult = allRegisters[`$${objectTransformed.rs}`] + objectTransformed.constant

	allRegisters[`$${objectTransformed.rt}`] = operationResult

	return `${instructionsOpCode[divInstruction.opCode]} $${objectTransformed.rt}, $${objectTransformed.rs}, ${objectTransformed.constant}`
}

function lb(instruction: string, allRegisters: Record<string, any>, memory: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)
	const address = allRegisters[`$${objectTransformed.rs}`] + objectTransformed.constant
	const value = memory[address]
	
	allRegisters[`$${objectTransformed.rt}`] = value ?? allRegisters[`$${objectTransformed.rt}`]
	
	return `${instructionsOpCode[divInstruction.opCode]} $${objectTransformed.rt}, ${objectTransformed.constant}($${objectTransformed.rs})`
}

function lbu(instruction: string, allRegisters: Record<string, any>, memory: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)
	const address = allRegisters[`$${objectTransformed.rs}`] + objectTransformed.constant
	const value = parseInt(memory[address])
	
	allRegisters[`$${objectTransformed.rt}`] = value ? parseInt(value.toString(2).substring(24), 2) : allRegisters[`$${objectTransformed.rt}`]
	
	return `${instructionsOpCode[divInstruction.opCode]} $${objectTransformed.rt}, ${objectTransformed.constant}($${objectTransformed.rs})`
}

function lui(instruction: string, allRegisters: Record<string, any>, memory: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)

	allRegisters[`$${objectTransformed.rt}`] = objectTransformed.constant << 16
	
	return `${instructionsOpCode[divInstruction.opCode]} $${objectTransformed.rt}, ${objectTransformed.constant}`
}

function sw(instruction: string, allRegisters: Record<string, any>, memory: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)
	const address = allRegisters[`$${objectTransformed.rs}`] + objectTransformed.constant
	
	memory[address] = allRegisters[`$${objectTransformed.rt}`]
	
	return `${instructionsOpCode[divInstruction.opCode]} $${objectTransformed.rt}, ${objectTransformed.constant}($${objectTransformed.rs})`
	
}

function sb(instruction: string, allRegisters: Record<string, any>, memory: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)
	const address = allRegisters[`$${objectTransformed.rs}`] + objectTransformed.constant
	
	memory[address] = allRegisters[`$${objectTransformed.rt}`]
	
	return `${instructionsOpCode[divInstruction.opCode]} $${objectTransformed.rt}, ${objectTransformed.constant}($${objectTransformed.rs})`
	
}

function lw(instruction: string, allRegisters: Record<string, any>, memory: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)
	const address = allRegisters[`$${objectTransformed.rs}`] + objectTransformed.constant
	const value = memory[address]
	
	allRegisters[`$${objectTransformed.rt}`] = value ?? allRegisters[`$${objectTransformed.rt}`]
	
	return `${instructionsOpCode[divInstruction.opCode]} $${objectTransformed.rt}, ${objectTransformed.constant}($${objectTransformed.rs})`
}

function andi(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)
	const rsProperty = `$${objectTransformed.rs}`

	allRegisters[rsProperty] = allRegisters[`$${objectTransformed.rt}`] & objectTransformed.constant

	return `${instructionsOpCode[divInstruction.opCode]} ${rsProperty}, $${objectTransformed.rt}, ${objectTransformed.constant}`
}

function beq(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)

	if (allRegisters[`$${objectTransformed.rs}`] == allRegisters[`$${objectTransformed.rt}`]) {

		allRegisters.pc += (objectTransformed.constant * 4)

		allRegisters.pc -= 4
	}
}

function bne(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)

	if (allRegisters[`$${objectTransformed.rs}`] != allRegisters[`$${objectTransformed.rt}`]) {

		allRegisters.pc += (objectTransformed.constant * 4)

		allRegisters.pc -= 4
	}
}

function bltz(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)

	if (allRegisters[`$${objectTransformed.rs}`] < 0) {

		allRegisters.pc += (objectTransformed.constant * 4)

		allRegisters.pc -= 4
	}
}

function blez(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)

	if (allRegisters[`$${objectTransformed.rs}`] <= 0) {

		allRegisters.pc += (objectTransformed.constant * 4)

		allRegisters.pc -= 4
	}
}

function bgtz(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)

	if (allRegisters[`$${objectTransformed.rs}`] > 0) {

		allRegisters.pc += (objectTransformed.constant * 4)

		allRegisters.pc -= 4
	}
}

function slti(instruction: string, allRegisters: Record<string, any>): string {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)
	const rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt)

	allRegisters[`$${objectTransformed.rs}`] = rsRt.rt < objectTransformed.constant ? 1 : 0

	return `${functions[divInstruction.opCode]} $${objectTransformed.rs}, $${objectTransformed.rt}, ${objectTransformed.constant}`
}

function ori(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)
	const rsProperty = `$${objectTransformed.rs}`

	allRegisters[rsProperty] = allRegisters[`$${objectTransformed.rt}`] | objectTransformed.constant

	return `${instructionsOpCode[divInstruction.opCode]} ${rsProperty}, $${objectTransformed.rt}, ${objectTransformed.constant}`
}

function xori(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)
	const rsProperty = `$${objectTransformed.rs}`

	allRegisters[rsProperty] = allRegisters[`$${objectTransformed.rt}`] ^ objectTransformed.constant

	return `${instructionsOpCode[divInstruction.opCode]} ${rsProperty}, $${objectTransformed.rt}, ${objectTransformed.constant}`
}

/* ----------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------
------------------------------------------------------------------------------------- */


//Funções para as instruções tipo R

function add(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)

	//Checagem de overflow
	if(checkOverflow(divInstruction.opcodeExtension, allRegisters[`$${objectTransformed.rs}`], allRegisters[`$${objectTransformed.rt}`])) {
		throw new Error(overflowMsg)
	}

	const operationResult = allRegisters[`$${objectTransformed.rs}`] + allRegisters[`$${objectTransformed.rt}`]

	allRegisters[`$${objectTransformed.rd}`] = operationResult

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}, $${objectTransformed.rs}, $${objectTransformed.rt}`
}

function addu(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)

	const operationResult = allRegisters[`$${objectTransformed.rs}`] + allRegisters[`$${objectTransformed.rt}`]

	allRegisters[`$${objectTransformed.rd}`] = operationResult

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}, $${objectTransformed.rs}, $${objectTransformed.rt}`

}

function div(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimal(divInstruction)

	const parsedInstruction = `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rs}, $${objectTransformed.rt}`

	// Rejeitando divisão por zero
	if (!objectTransformed.rs || !objectTransformed.rt) {
		allRegisters.lo = 0
		allRegisters.hi = 0

		return parsedInstruction
	}

	const rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt)
	const loResult = Math.floor(rsRt.rs / rsRt.rt)
	const hiResult = rsRt.rs % rsRt.rt

	allRegisters.lo = loResult
	allRegisters.hi = hiResult

	return parsedInstruction
}

function divu(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimal(divInstruction)

	const parsedInstruction = `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rs}, $${objectTransformed.rt}`

	// Rejeitando divisão por zero
	if (!objectTransformed.rs || !objectTransformed.rt) {
		allRegisters.lo = 0
		allRegisters.hi = 0

		return parsedInstruction
	}

	const rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt)
	const loResult = Math.floor(rsRt.rs / rsRt.rt)
	const hiResult = rsRt.rs % rsRt.rt

	allRegisters.lo = loResult
	allRegisters.hi = hiResult

	return parsedInstruction
}

function sub(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)

	//Checagem de Overflow
	if (checkOverflow(divInstruction.opcodeExtension, allRegisters[`$${objectTransformed.rs}`], allRegisters[`$${objectTransformed.rt}`])) {
		throw new Error(overflowMsg)
	}

	const operationResult = allRegisters[`$${objectTransformed.rs}`] - allRegisters[`$${objectTransformed.rt}`]

	allRegisters[`$${objectTransformed.rd}`] = operationResult

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}, $${objectTransformed.rs}, $${objectTransformed.rt}`

}

function subu(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)

	const operationResult = allRegisters[`$${objectTransformed.rs}`] - allRegisters[`$${objectTransformed.rt}`]

	allRegisters[`$${objectTransformed.rd}`] = operationResult

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}, $${objectTransformed.rs}, $${objectTransformed.rt}`
}

function mult(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)

	const rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt)
	const loResult = Math.floor(rsRt.rs * rsRt.rt)
	const hiResult = rsRt.rs % rsRt.rt

	//Precisa adicionar a condição de overflow

	allRegisters.lo = loResult
	allRegisters.hi = hiResult

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rs}, $${objectTransformed.rt}`

}

function multu(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)


	const rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt)
	const loResult = Math.floor(rsRt.rs * rsRt.rt)
	const hiResult = rsRt.rs % rsRt.rt

	//Precisa adicionar a condição de overflow
	allRegisters.lo = loResult
	allRegisters.hi = hiResult

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rs}, $${objectTransformed.rt}`
}

function mflo(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)

	allRegisters[`$${objectTransformed.rd}`] = allRegisters.lo

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}`
}

function mfhi(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)

	allRegisters[`$${objectTransformed.rd}`] = allRegisters.hi

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}`
}

function slt(instruction: string, allRegisters: Record<string, any>): string {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)
	const rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt)

	allRegisters[`$${objectTransformed.rd}`] = rsRt.rs < rsRt.rt ? 1 : 0

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}, $${objectTransformed.rs}, $${objectTransformed.rt}`
}

function sll(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)
	const rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt)

	allRegisters[`$${objectTransformed.rd}`] = rsRt.rt * Math.pow(2, objectTransformed.shift)

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}, $${objectTransformed.rt}, ${objectTransformed.shift},`
}

function srl(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)
	const rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt)

	allRegisters[`$${objectTransformed.rd}`] = rsRt.rt * Math.pow(2, (-1) * objectTransformed.shift)

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}, $${objectTransformed.rt}, ${objectTransformed.shift},`
}

function sllv(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)
	const rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt)

	allRegisters[`$${objectTransformed.rd}`] = rsRt.rt << objectTransformed.rs

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}, $${objectTransformed.rt}, $${objectTransformed.rs},`
}

function srlv(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)
	const rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt)

	allRegisters[`$${objectTransformed.rd}`] = rsRt.rt >> objectTransformed.rs

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}, $${objectTransformed.rt}, $${objectTransformed.rs},`
}

function sra(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)
	const rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt)

	allRegisters[`$${objectTransformed.rd}`] = rsRt.rt >> objectTransformed.shift

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}, $${objectTransformed.rt}, ${objectTransformed.shift},`
}

function srav(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)
	const rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt)

	allRegisters[`$${objectTransformed.rd}`] = rsRt.rt >> objectTransformed.rs

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}, $${objectTransformed.rt}, ${objectTransformed.rs},`
}


/*----------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------*/

//Intruções Tipo J
function j(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionJ(instruction)
	const objectTransformed = objectToDecimalJ(divInstruction)

	allRegisters.pc = objectTransformed.jumpTargetAddress * 4

	return `${functions[divInstruction.opCode]} ${objectTransformed.jumpTargetAddress}`
}

function jal(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionJ(instruction)
	const objectTransformed = objectToDecimalJ(divInstruction)

	allRegisters.$31 = allRegisters.pc

	allRegisters.pc = objectTransformed.jumpTargetAddress * 4

	return `${functions[divInstruction.opCode]} ${objectTransformed.jumpTargetAddress}`
}
