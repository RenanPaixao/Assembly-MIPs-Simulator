/** Create all numeric registers and no numeric also as entries to create an object to manipulate them.
 * These registers are with 0 as value.
 */
export function initializeRegisters() {
const numericRegisters = Array(32).fill(0).map((_, i) => [`$${i}`, 0])
const nonNumericRegisters = [['pc', 0], ['hi', 0], ['lo', 0]]

const registers: Record<string, any> = Object.fromEntries([...numericRegisters, ...nonNumericRegisters])

/** Add values different from 0 to the registers that need it. **/
registers.$28 = 268468224
registers.$29 = 2147479548
registers.lo = 4194304
	
	return registers
}

export function removeInvalidRegisters(registers: Record<string, any>) {
	const localRegisters = {...registers}
	Object.entries(localRegisters).forEach(([key, value]) => {
		value === 0 && delete localRegisters[key]
	})
	
	return localRegisters
}