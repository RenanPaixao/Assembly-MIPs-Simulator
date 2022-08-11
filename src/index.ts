// @ts-ignore
import hexToBinary from 'hex-to-binary'
import { readFileSync } from 'fs'
import * as Types from './utils/types'
import { initializeRegisters, removeInvalidRegisters } from './utils/registers.js'
import { decodeInstruction } from './utils/instructions.js'
import { getFileNames, resetOutput, writeOutput } from './utils/jsonHandler.js'

let allRegisters = initializeRegisters()
let memory: Record<string, any> = {}
let text: Record<string, any> = {}
let data: Record<string, any> = {}

const fileNames = getFileNames()
fileNames.forEach((name)=>{
	
	const json = readFileSync(`./src/input/${name}`).toString()
	const input: Types.Input = JSON.parse(json)
	let output: Types.Output[] = [] as Types.Output[]
	
	Object.keys(input).forEach((key)=> (input[key] ?? (input[key] = {})))
	/** --------------------------------------------------
	 *
	 * Initialize the registers, memory and data with the values from the input.
	 *
	 * ---------------------------------------------------**/
	
	Object.entries(input.config?.regs ?? {}).forEach(([key, value]) => {
		allRegisters[key] = value
	})
	
	Object.entries(input.config?.mem ?? {}).forEach(([key, value]) => {
		memory[key] = hexToBinary(value)
	})
	
	Object.entries(input?.data ?? {}).forEach(([key, value]) => {
		data[key] = value
	})
	
	text = input?.text ? input.text.map(value =>{
			return hexToBinary(value.replace('0x', ''))
		}) : {}
	
	
	if(text?.length) {
		text.forEach((value, index) => {
			
			const instructionOutput = {} as Types.Output
			resetOutput(instructionOutput)
			
			instructionOutput.hex = input.text[index]
			instructionOutput.text = decodeInstruction(value, allRegisters, instructionOutput) ?? {}
			instructionOutput.regs = removeInvalidRegisters(allRegisters) ?? {}
			instructionOutput.mem = input.config?.mem ?? {}
			instructionOutput.stdout = instructionOutput.stdout ?? {}
			
			output.push(instructionOutput)
		})
	}else{
		const instructionOutput = {} as Types.Output
		
		instructionOutput.regs = removeInvalidRegisters(allRegisters) ?? {}
		instructionOutput.mem = input.config?.mem ?? {}
		instructionOutput.stdout = {}
		
	}
	writeOutput(name, output)
	allRegisters = initializeRegisters()
	memory= {}
	text = {}
	data = {}
})
