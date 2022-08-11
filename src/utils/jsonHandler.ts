import { writeFileSync } from 'fs'
import { Output } from './types'

export function writeOutput(name: string, data: any) {
	writeFileSync(`./src/output/${name}.output.json`, JSON.stringify(data, null, 2), {})
}

export function resetOutput(data: Output) {
	Object.keys(key => data[key] = {})
}