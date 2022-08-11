interface Config {
	regs: {
	[key: string]: number
}
	mem: {
		[key: string]: number
	}
}

export interface Input {
	config?: Partial<Config>
	data?: Record<string, any>
	text: string[] | Record<string, any>
}

export interface Output {
	hex: string | {}
	text: string | {}
	regs: {
		[key: string]: number
	}
	mem: {
		[key: string]: number
	}
	stdout?: 'overflow' | {}
}