interface Config {
	regs: string[]
	mem: {
		[key: string]: number
	}
}

interface Data {
	data: {
		[key: string]: string
	}
}

export interface Input {
	config?: Partial<Config>
	data?: Data
	text: string[]
}

export interface Output {
	hex: string
	text: string
	regs: {
		[key: string]: number
	}
	mem: {
		[key: string]: number
	}
	stdout?: 'overflow'
}