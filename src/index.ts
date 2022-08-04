import { initializeRegisters, removeInvalidRegisters } from './utils/registers.js'
import * as Types from './utils/types'
import { readFileSync } from 'fs'

let allRegisters = initializeRegisters()
let memory: Record<string, any> = {}
let data: Record<string, any> = {}

const add = readFileSync('./src/input/Add.input.json').toString()

const json: Types.Input = JSON.parse(add)

/** --------------------------------------------------
 *
 * Initialize the registers, memory and data with the values from the input.
 *
 * ---------------------------------------------------**/

Object.entries(json.config?.regs ?? {}).forEach(([key, value]) => {
	allRegisters[key] = value
})

Object.entries(json.config?.mem ?? {}).forEach(([key, value]) => {
	memory[key] = value
})

Object.entries(json.data ?? {}).forEach(([key, value]) => {
	data[key] = value
})

/** -------------------------------------------------- **/




