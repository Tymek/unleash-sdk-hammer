import { spawn } from 'bun'

const UNLEASH_URL = process.env.UNLEASH_URL || 'http://localhost:4242'
const UNLEASH_TOKEN = process.env.UNLEASH_URL // Prefer use of PAT (personal access tokens)

if (!UNLEASH_TOKEN) {
	throw new Error(`Token needed. Get one from ${UNLEASH_URL}/profile/personal-api-tokens`)
}

const configPath = './config.json'
const file = Bun.file(configPath)
if (!(await file.exists())) {
	throw new Error('Run setup first')
}
const config = await file.json()

console.info("\n# IT'S HAMMER TIME #\n")

const buns = new Array(config.tokens.length)

for (let i = 0; i < buns.length; i++) {
	buns[i] = spawn({
		cmd: ['bun', './app.ts', config.tokens[i]],
		stdout: 'inherit',
		stderr: 'inherit',
		stdin: 'inherit',
	})
}

function kill() {
	for (const bun of buns) {
		bun.kill()
	}
}

process.on('SIGINT', kill)
process.on('exit', kill)
