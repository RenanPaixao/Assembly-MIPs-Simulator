import { initializeRegisters, removeInvalidRegisters } from './utils/registers.js'
// @ts-ignore
import hexToBinary from 'hex-to-binary'
import * as Types from './utils/types'
import { readFileSync } from 'fs'

let allRegisters = initializeRegisters()
let memory: Record<string, any> = {}
let data: Record<string, any> = {}

const add = readFileSync('./src/input/Add.input.json').toString()

const input: Types.Input = JSON.parse(add)
const output: Partial<Types.Output> = {}

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

Object.entries(input.data?.data ?? {}).forEach(([key, value]) => {
	data[key] = value
})

input.text = input.text.map(value =>{
	return hexToBinary(value.replace('0x', ''))
})

console.log(input.text)

/** -------------------------------------------------- **/



