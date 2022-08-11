// @ts-ignore
import hexToBinary from 'hex-to-binary'
import { readFileSync } from 'fs'
import * as Types from './utils/types'
import { initializeRegisters, removeInvalidRegisters } from './utils/registers.js'
import { decodeInstruction } from './utils/instructions.js'
import { resetOutput, writeOutput } from './utils/jsonHandler.js'

let allRegisters = initializeRegisters()
let memory: Record<string, any> = {}
let text: Record<string, any> = {}
let data: Record<string, any> = {}

const add = readFileSync('./src/input/Add.input.json').toString()

const input: Types.Input = JSON.parse(add)
const output: Types.Output = {} as Types.Output

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
		output.hex = input.text[index]
		output.text = decodeInstruction('00100010000100010000000000000100', allRegisters) ?? {}
		output.regs = removeInvalidRegisters(allRegisters) ?? {}
		output.mem = input.config?.mem ?? {}
		output.stdout = ''
		
		resetOutput(output)
		writeOutput('Add', output)
	})
}else{
	output.regs = removeInvalidRegisters(allRegisters) ?? {}
	output.mem = input.config?.mem ?? {}
	output.stdout = {}
	
	writeOutput('add', output)
}