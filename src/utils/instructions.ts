const instructionsOpCode = {
	'001000': 'addi', //done
	'001001': 'addiu', //done
	'001100': 'andi', //in progress
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
	'100000': 'add', //done
	'100001': 'addu', //done
	'100100': 'and',
	'011010': 'div', //done
	'011011': 'divu',
	'001000': 'jr',
	'010000': 'mfhi', //done
	'010010': 'mflo', //done
	'011000': 'mult', //done
	'011001': 'multu', //done
	'100111': 'nor',
	'100101': 'or',
	'000000': 'sll',
	'000100': 'sllv',
	'101010': 'slt',
	'000011': 'sra',
	'000111': 'srav',
	'000010': 'srl',
	'000110': 'srlv',
	'100010': 'sub', //done
	'100011': 'subu', //done
	'001100': 'syscall',
	'100110': 'xor',
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

function checkOverflow(op: string, value1: number, value2: number) {

	let minValue = Number.MIN_VALUE
	let maxValue = Number.MAX_VALUE
	let cont1 = value1
	let cont2 = value2

	switch (op) {
		case '+':
			if ((cont1 + cont2) > maxValue || (cont1 + cont2) < minValue) {
				return true
			} break
		case '-':
			if ((cont1 - cont2) > maxValue || (cont1 - cont2) < minValue) {
				return true
			} break
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

function getRsAndRtFromBinary(allRegisters: Record<string, any>, rs: string | number, rt: string | number) {
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

export function decodeInstruction(instruction: string, allRegisters: Record<string, any>) {
	const instructionName = instructionsOpCode[getOpCode(instruction)]

	if (getOpCode(instruction) !== '000000') {
		const instructionI = divInstructionI(instruction)
		
		//Adiciona mais 4 para o pc, indicando uma instrução
		allRegisters.pc += 4
		
		switch (instructionI.opCode) {
			case '001000':
				return addi(instruction, allRegisters)
			case '001001':
				return addiu(instruction, allRegisters)
			case '001100':
				return andi(instruction, allRegisters)
			default:
				console.log('------------------------------')
				allRegisters.pc -= 4
			// throw new Error('Instruction not found')
		}
	}
	
	/*------------------------------------------------------------------------------------------------------------------*/
		const instructionR = divInstructionR(instruction)
	
		switch (instructionR.opcodeExtension) {
			case '100000':
				return add(instruction, allRegisters)
			case '100001':
				return addu(instruction, allRegisters)
			case '011010':
				return div(instruction, allRegisters)
			case '100010':
				return sub(instruction, allRegisters)
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
			default:
				allRegisters.pc -= 4
				console.log('---------------------------')
				// throw new Error('Instruction not found!')
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

function addi(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	const objectTransformed = objectToDecimal(divInstruction)

	//Precisa adicionar a checagem de overflow

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

function andi(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionI(instruction)
	//const objectTransformed = objectToDecimal(divInstruction)

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

	//Precisa adicionar a checagem de overflow

	const operationResult = allRegisters[`$${objectTransformed.rs}`] + allRegisters[`$${objectTransformed.rt}`]

	allRegisters[`$${objectTransformed.rd}`] = operationResult

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}, $${objectTransformed.rs}, ${objectTransformed.rt}`

}

function addu(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)

	const operationResult = allRegisters[`$${objectTransformed.rs}`] + allRegisters[`$${objectTransformed.rt}`]

	allRegisters[`$${objectTransformed.rd}`] = operationResult

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}, $${objectTransformed.rs}, ${objectTransformed.rt}`

}

function div(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimal(divInstruction)
	
	const parsedInstruction = `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rs}, $${objectTransformed.rt}`
	
	console.log(objectTransformed)
	// Rejeitando divisão por zero
	if(!objectTransformed.rs || !objectTransformed.rt) {
		allRegisters.lo = 0
		allRegisters.hi = 0
		
		return parsedInstruction
	}
	
	const rsRt = getRsAndRtFromBinary(allRegisters, objectTransformed.rs, objectTransformed.rt)
	const loResult =  Math.floor(rsRt.rs / rsRt.rt)
	const hiResult = rsRt.rs % rsRt.rt
	
	allRegisters.lo = loResult
	allRegisters.hi = hiResult
	
	return parsedInstruction
}

function sub(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)

	//Precisa adicionar a checagem de overflow

	const operationResult = allRegisters[`$${objectTransformed.rs}`] - allRegisters[`$${objectTransformed.rt}`]

	allRegisters[`$${objectTransformed.rd}`] = operationResult

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}, $${objectTransformed.rs}, ${objectTransformed.rt}`

}

function subu(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)

	const operationResult = allRegisters[`$${objectTransformed.rs}`] - allRegisters[`$${objectTransformed.rt}`]

	allRegisters[`$${objectTransformed.rd}`] = operationResult

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}, $${objectTransformed.rs}, ${objectTransformed.rt}`

}

function mult(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)

	//Precisa adicionar a condição de overflow

	const operationResult = allRegisters[`$${objectTransformed.rs}`] * allRegisters[`$${objectTransformed.rt}`]

	allRegisters['lo'] = operationResult

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rs}, $${objectTransformed.rt}`

}

function multu(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)


	const operationResult = allRegisters[`$${objectTransformed.rs}`] * allRegisters[`$${objectTransformed.rt}`]

	allRegisters['lo'] = operationResult

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rs}, $${objectTransformed.rt}`

}

function mflo(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)

	allRegisters[`$${objectTransformed.rd}`] = allRegisters['lo']

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}`

}

function mfhi(instruction: string, allRegisters: Record<string, any>) {
	const divInstruction = divInstructionR(instruction)
	const objectTransformed = objectToDecimalR(divInstruction)

	allRegisters[`$${objectTransformed.rd}`] = allRegisters['hi']

	return `${functions[divInstruction.opcodeExtension]} $${objectTransformed.rd}`

}

